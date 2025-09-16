import express from 'express'
import { getPartner, getUser, loginFoodPartner, loginUser, logoutFoodPartner, logoutUser, registerFoodPartner, registerUser } from '../controllers/auth.controller.js'
import { authFoodPartnerMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/user/register', registerUser )
router.post('/user/login', loginUser )
router.get('/user/logout', logoutUser )
router.get('/me/user', getUser )

router.post('/partner/register', registerFoodPartner )
router.post('/partner/login', loginFoodPartner )
router.get('/partner/logout', logoutFoodPartner )
router.get('/me/partner', authFoodPartnerMiddleware, getPartner )


export default router