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
    // ✅ ObjectId thi String karyu — frontend "Technology" jevi string mokle
    category: {
        type: String,
        required: true
    },
    tags: [
        {
            type: String,
        }
    ],
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

BlogSchema.virtual("Comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "blog"
});

const Blogger = mongoose.model("Blogger", BlogSchema);

export default Blogger;
