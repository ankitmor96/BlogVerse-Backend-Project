import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    categoryName: {
        type: String,
        unique: true,
        trim:true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    }

},
    {
        timestamps: true,

        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
);

categorySchema.virtual("Blogs", {
    ref: "Blogger",
    localField: "_id",
    foreignField: "category"
});

const category = mongoose.model("category", categorySchema);

export default category;