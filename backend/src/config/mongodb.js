import mongoose from "mongoose";
import { DB_NAME } from "../constant/dbname.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
        console.log("mongoDB connected success");
    } catch (error) {
        console.log("database not connected", error)
    }
}
export default connectDB;