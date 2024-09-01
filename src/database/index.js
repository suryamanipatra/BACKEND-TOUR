import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"


const dbConnect = async () => {
    try {
        const dbInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Database Connection Successfully !! DB Host:${dbInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection error", error)
        process.exit(1)
    }
}

export default dbConnect