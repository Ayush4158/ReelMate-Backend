import User from "../model/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import FoodPartner from "../model/foodPartner.model.js";

export async function registerUser(req,res){
  
  const {fullname, email, password} = req.body;

  const isUserAlreadyExists = await User.findOne({email})
  if(isUserAlreadyExists){
    return res.status(400).json({
      message: "User already exists"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword
  })

  const token = jwt.sign({
    id: user._id,
  }, process.env.JWT_SECRET)

 res.cookie("token", token, {
  httpOnly: true,
  secure: true,     // true only in production
  sameSite: "none"
});

  return res.status(201).json({
    message: "User created successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname
    },
  })
}

export async function loginUser(req,res){

  const {email, password} = req.body;

  const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({
      message: "Invalid Credential"
    })
  }

  const isPassowrdCorrect = await bcrypt.compare(password, user.password)
  if(!isPassowrdCorrect){
    return res.status(400).json({
      message: "Invalid Credential"
    })
  }

  const token = jwt.sign({
    id: user._id,
  }, process.env.JWT_SECRET)

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,     // true only in production
  sameSite: "none"
});

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname
    },
  })
}

export async function logoutUser(req,res){
  res.clearCookie('token');
  return res.status(200).json({
    message: "User logged out successfully"
  })
}

export async function getUser(req, res){
  const user = req.user
  return res.status(200).json({
    message: "Authenticated User",
    user
  })
}

export async function registerFoodPartner(req,res){

  const{name, email, password, phone, address, contactName} = req.body

  const isAccountAlredyExists = await FoodPartner.findOne({email})

  if(isAccountAlredyExists){
    return res.status(400).json({
      message: "User already exists"
    })
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const foodPartner = await FoodPartner.create({
    name,
    email,
    phone,
    contactName,
    address,
    password: hashPassword
  })

  const token = jwt.sign({
    id: foodPartner._id
  }, process.env.JWT_SECRET)

res.cookie("token", token, {
  httpOnly: true,
  secure: true,     // true only in production
  sameSite: "none"
});

  return res.status(201).json({
    message: "Food Partner registered successfully",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
      phone: foodPartner.phone,
      address: foodPartner.address,
      contactName: foodPartner.contactName,
    }
  })
}

export async function loginFoodPartner(req,res){
  const {email, password} = req.body

  const foodPartner = await FoodPartner.findOne({email})

  if(!foodPartner){
    return res.status(400).json({
      message: "Invalid Credentials"
    })
  }

  const isPassowrdCorrect = await bcrypt.compare(password, foodPartner.password)
  if(!isPassowrdCorrect){
    return res.status(400).json({
      message: "Invalid Credentials"
    })
  }

  const token = jwt.sign({
    id: foodPartner._id
  }, process.env.JWT_SECRET)
  
res.cookie("token", token, {
  httpOnly: true,
  secure: true,     // true only in production
  sameSite: "none"
});

  return res.status(200).json({
    message: "Food Partner logged in successfully",
    foodPartner:{
      name: foodPartner.name,
      email: foodPartner.email
    }
  })
}

export async function logoutFoodPartner(req,res){
  res.clearCookie("token");
  return res.status(200).json({
    messaage: "Food Partner logged out successfully"
  })
}

export async function getPartner(req, res){
  const foodPartner = req.foodPartner
  return res.status(200).json({
    message: "Authenticated food-Partner",
    foodPartner
  })
}