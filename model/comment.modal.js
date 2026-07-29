
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true,
        trim:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blogger",
        required:true
    },

},

{
    timestamps:true,

    toJSON:{virtuals:true},
    toObject:{virtuals:true}
},

);

const Comment = mongoose.model("Comment" , CommentSchema);

export default Comment;