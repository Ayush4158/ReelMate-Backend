// auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import FoodPartner from "../model/foodPartner.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL; // e.g. "https://your-frontend.vercel.app"
const NODE_ENV = process.env.NODE_ENV || "development";

if (!JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET is not set in env. Set process.env.JWT_SECRET for production.");
}

// helpers
function createAccessToken(payload) {
  // short lived token (used in Authorization header)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

function createRefreshToken(payload) {
  // longer lived token stored in HttpOnly cookie
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: NODE_ENV === "production", // true only in production (requires https)
    sameSite: NODE_ENV === "production" ? "none" : "lax", // none for cross-site in prod
    // domain: ".yourdomain.com", // OPTIONAL: set if you want cookie to be shared across subdomains
    path: "/", // allow refresh endpoint to read it
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };
}

// Generic error response
function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ message: "Server Error" });
}

// ----- User routes -----
export async function registerUser(req, res) {
  try {
    const { fullname, email, password } = req.body || {};
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "fullname, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // create tokens
    const accessToken = createAccessToken({ id: user._id, role: "user" });
    const refreshToken = createRefreshToken({ id: user._id, role: "user" });

    // set refresh token cookie
    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    return res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: { _id: user._id, email: user.email, fullname: user.fullname },
    });
  } catch (err) {
    return serverError(res, err);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken({ id: user._id, role: "user" });
    const refreshToken = createRefreshToken({ id: user._id, role: "user" });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    return res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      user: { _id: user._id, email: user.email, fullname: user.fullname },
    });
  } catch (err) {
    return serverError(res, err);
  }
}

export async function logoutUser(req, res) {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken", refreshCookieOptions());
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return serverError(res, err);
  }
}

export async function getUser(req, res) {
  try {
    // auth middleware attaches req.user
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    return res.status(200).json({ message: "Authenticated User", user });
  } catch (err) {
    return serverError(res, err);
  }
}

// ----- Food Partner routes -----
export async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const exists = await FoodPartner.findOne({ email });
    if (exists) return res.status(400).json({ message: "Account already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const fp = await FoodPartner.create({
      name,
      email,
      phone,
      contactName,
      address,
      password: hashed,
    });

    const accessToken = createAccessToken({ id: fp._id, role: "foodPartner" });
    const refreshToken = createRefreshToken({ id: fp._id, role: "foodPartner" });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    return res.status(201).json({
      message: "Food Partner registered successfully",
      accessToken,
      foodPartner: {
        _id: fp._id,
        name: fp.name,
        email: fp.email,
        phone: fp.phone,
        address: fp.address,
        contactName: fp.contactName,
      },
    });
  } catch (err) {
    return serverError(res, err);
  }
}

export async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const fp = await FoodPartner.findOne({ email });
    if (!fp) return res.status(400).json({ message: "Invalid credentials" });

    const isCorrect = await bcrypt.compare(password, fp.password);
    if (!isCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken({ id: fp._id, role: "foodPartner" });
    const refreshToken = createRefreshToken({ id: fp._id, role: "foodPartner" });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    return res.status(200).json({
      message: "Food Partner logged in successfully",
      accessToken,
      foodPartner: { _id: fp._id, name: fp.name, email: fp.email },
    });
  } catch (err) {
    return serverError(res, err);
  }
}

export async function logoutFoodPartner(req, res) {
  try {
    res.clearCookie("refreshToken", refreshCookieOptions());
    return res.status(200).json({ message: "Food Partner logged out successfully" });
  } catch (err) {
    return serverError(res, err);
  }
}

// ----- Token refresh endpoint -----
export async function refreshAccessToken(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token, please login" });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // payload contains id and role
    const { id, role } = payload;

    // Optional: check that the user still exists
    if (role === "user") {
      const user = await User.findById(id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });
    } else if (role === "foodPartner") {
      const fp = await FoodPartner.findById(id).select("-password");
      if (!fp) return res.status(401).json({ message: "Food partner not found" });
    }

    // issue new access token
    const accessToken = createAccessToken({ id, role });
    return res.status(200).json({ accessToken });
  } catch (err) {
    return serverError(res, err);
  }
}
