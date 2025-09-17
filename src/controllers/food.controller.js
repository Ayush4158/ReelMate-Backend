import Food from '../model/food.model.js'
import Like from '../model/lieks.model.js'
import Save from '../model/save.model.js'
import { uploadFile } from '../services/storage.service.js'
import {v4 as uuid} from "uuid"

export async function createFood(req,res){
  const {name, description} = req.body

  const fileUploadResult = await uploadFile(req.file.buffer, uuid())

  const foodItem = await Food.create({
    name,
    description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id
  })
  
  return res.status(201).json({
    message: "Food Item created successfully",
    foodItem
  })
}

export async function getFoodItem(req,res){
  const foodItems = await Food.find()
  res.status(200).json({
    message: "Food item fetched successfully",
    foodItems
  })
}

export async function getSavedFoodItem(req, res) {
  const user = req.user._id;

  const savedFood = await Save.find({ user }); 

  const foodIds = savedFood.map((item) => item.food); 

  const savedVideo = await Food.find({ _id: { $in: foodIds } }); 

  return res.status(200).json({
    message: "Saved video fetched successfully",
    savedVideo,
  });
}

export async function likeFood(req, res) {
  const { foodId } = req.body;

  try {
    const isLikedAlready = await Like.findOne({
      user: req.user._id,
      food: foodId,
    });

    if (isLikedAlready) {
      await Like.deleteOne({ user: req.user._id, food: foodId });

      const updatedFood = await Food.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: -1 } },
        { new: true } // ✅ return updated document
      );

      return res.status(200).json({
        message: "Food disliked successfully",
        likeCount: updatedFood.likeCount,
      });
    }

    await Like.create({ user: req.user._id, food: foodId });

    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { $inc: { likeCount: 1 } },
      { new: true } // ✅ return updated document
    );

    return res.status(200).json({
      message: "Food liked successfully",
      likeCount: updatedFood.likeCount,
    });
  } catch (error) {
    console.error("Error in likeFood:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadySaved = await Save.findOne({ user: user._id, food: foodId });

  if (isAlreadySaved) {
    await Save.deleteOne({ user: user._id, food: foodId });
    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { $inc: { saveCount: -1 } },
      { new: true }
    );

    return res.status(200).json({
      message: "Video unsaved successfully",
      saveCount: updatedFood.saveCount, 
    });
  }

  await Save.create({ user: user._id, food: foodId });
  const updatedFood = await Food.findByIdAndUpdate(
    foodId,
    { $inc: { saveCount: 1 } },
    { new: true }
  );

  return res.status(200).json({
    message: "Video saved successfully",
    saveCount: updatedFood.saveCount, 
  });
}
