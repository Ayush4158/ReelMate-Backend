import express from "express"
import {  authUserMiddleware } from "../middlewares/auth.middleware.js"
import { getFoodPartner } from "../controllers/foodPartner.controller.js"
const router = express.Router()

router.get("/:id", authUserMiddleware, getFoodPartner)

export default router