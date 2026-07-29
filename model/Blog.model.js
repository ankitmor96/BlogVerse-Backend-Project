
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"category", // Relationship with category model
        required: true
    },
    tags: [
        {
            type: String,
            required: true
        }
    ],
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",  // Relationship with user model
        required: true
    },
    views: {
        type: Number,
        default: "0"
    },
    likeCount: {
        type: Number,
        default: "0"
    },
    commentCount: {
        type: Number,
        default: "0"
    },
},
    {
        timestamps: true,
    }
);

BlogSchema.virtual("Comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"blog"
});

const Blogger = mongoose.model("Blogger", BlogSchema);

export default Blogger;