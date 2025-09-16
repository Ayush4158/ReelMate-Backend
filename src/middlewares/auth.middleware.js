import FoodPartner from "../model/foodPartner.model.js"
import jwt from 'jsonwebtoken'
import User from "../model/user.model.js";

export async function authFoodPartnerMiddleware(req,res,next) {
  
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      message: "Unauthorized access"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const foodPartner = await FoodPartner.findById(decoded.id)
    req.foodPartner = foodPartner
    next()

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    })
  }

}

export async function authUserMiddleware(req,res,next) {
  const token = req.cookies.token
  if(!token){
    return res.status(401).json({
      message: "Unauthorized access"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    })
  }
}