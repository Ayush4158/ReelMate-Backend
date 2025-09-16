import express from "express"
import { createFood, getFoodItem, getSavedFoodItem, likeFood, saveFood } from "../controllers/food.controller.js"
import { authFoodPartnerMiddleware, authUserMiddleware} from "../middlewares/auth.middleware.js"
import multer from 'multer'
const router = express.Router()

const upload = multer({  //for reading file, without this express can't read file and it will sotore the data into req.file
  storage: multer.memoryStorage() 
})

router
.post('/',authFoodPartnerMiddleware, upload.single("video") ,createFood)
.get('/', authUserMiddleware, getFoodItem)

router.post('/like', authUserMiddleware, likeFood)
router.post('/save', authUserMiddleware, saveFood)
router.get('/saved-video', authUserMiddleware, getSavedFoodItem)


export default router