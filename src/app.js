// Create server
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://reelmate.vercel.app",        
    "https://reelmate-eimk0gx3s-aysuh-singhs-projects.vercel.app" 
  ],
  credentials: true   
}));
app.use(express.json())   //read req.body
app.use(cookieParser())

import authRouter from './routes/auth.route.js'
import foodRouter from './routes/food.route.js'
import foodPartnerRouter from './routes/foodPartner.route.js'

app.use('/api/auth', authRouter)
app.use('/api/food', foodRouter)
app.use('/api/food-partner', foodPartnerRouter)

export {app}