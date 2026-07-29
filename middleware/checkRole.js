import HttpError from "../middleware/HttpError.js";

const checkRole = (...roles) => async (req ,res ,next)=>{
    try{

        if(!req.user){
            return next(new HttpError("This user not login",404));
        }

        if(!roles.includes(req.user.role)){
            return next (new HttpError ("forbidden access",404));
        }

        next();

    }catch(error){
        return next(new HttpError(error.message,500));
    }
};

export default checkRole;