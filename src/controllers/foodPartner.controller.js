import Food from "../model/food.model.js";
import FoodPartner from "../model/foodPartner.model.js";

export async function getFoodPartner(req,res){
  const foodPartnerId = req.params.id

  const foodPartner = await FoodPartner.findById(foodPartnerId)

  const foodItemsByFoodPartner = await Food.find({foodPartner: foodPartner})

  if(!foodPartner){
    return res.status(400).json({
      message: "Partner not found"
    })
  }

  return res.status(200).json({
    message: "Fetched Successfully",
    foodPartner: {
      ...foodPartner.toObject(), foodItems: foodItemsByFoodPartner
    },
  })
}