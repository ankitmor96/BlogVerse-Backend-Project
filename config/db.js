import mongoose from "mongoose";
import HttpError from "../middleware/HttpError.js";

const ConnectDB = async (req ,res , next)=>{
    try{
        const connectdb = mongoose.connect(process.env.MONGO_URI);

        console.log(process.env.MONGO_URI);

        console.log("mongodb connect successFully");

    }catch(error){
        return next(new HttpError(error.message,500));
    }
};

export default ConnectDB;