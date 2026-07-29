import { Schema } from "mongoose";
import registerSchema from "../validation/registerSchema.js";

const validate = (Schema) => (req,res,next)=>{
           try{

             const {error,value} = Schema.
             validate(req.body, {
               
                abortEarly:true,
                allowUnkown:false,
            });

            if(error){
                throw new Error(error.details[0].message,400);
            }

            next();

            return value;

           }catch(error){
            throw new Error(error.message,500);
           }
};

export default validate;