import mongoose from "mongoose";

const ConnectToDb = async () => {
    try {
     const connection =await mongoose.connect(process.env.MONGO_URI)
     if (connection) {
        console.log("Database Connected Succesfully")
     }
    } catch (error) {
        console.error(error)
    }
}

export {ConnectToDb}