// Start server
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import {app} from './src/app.js'
import connectToDb from './src/db/db.js'

connectToDb().then(() => {
  app.on('error', (error) => {
    console.log("Error ", error)
    throw error
  })
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
  })
})


