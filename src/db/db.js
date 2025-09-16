import mongoose from "mongoose";

const connectToDb = async() => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("Mongodb Connectino failed: ", error)
    process.exit(1)
  }
}

export default connectToDb