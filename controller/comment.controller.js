import HttpError from "../middleware/HttpError.js";
import Comment from "../model/comment.modal.js";

const addComment = async(req ,res ,next)=>{
    try{

        const {content} = req.body;

        const userId = req.params.id;

        const blogId = req.params.id;

        const newComment = await Comment.create({
            content,
            user: userId,
            blog: blogId
        });

        res.status(201).json({
            success:true,
            message:"new comment add successFully",
            data:newComment
        });

    }catch(error){
        return next(new HttpError(error.message,500));
    }
};

export default {addComment};