import mongoose from "mongoose";
import HttpError from "../middleware/HttpError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        uniuqe: true
    },
    password: {
        type: String,
        required: true,
        validate: ((value) => {
            if (value.toLowerCase() === "password") {
                throw new Error("password can not used for password key word");
            }
        }),
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    ProfileImage:{
        type:String,
        required:true
    },
    isverified: {
        type: Boolean,
        default: "false"
    },
    tokens: [
        {
            token: {
                type: String,
            },
        },
    ],
},
    {
        timestamps: true,

        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    },
);

userSchema.virtual("Blogs" , {
    ref:"Blogger",
    localField:"_id",
    foreignField:"author"
});

userSchema.virtual("Comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"user"
});

userSchema.pre("save", async function () {

    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.statics.findByCredentials  = async function (email, password) {

    const user = await User.findOne({ email });

    if (!user) {
        
        throw new Error("This user not found",404);
    }

    const isModified = await bcrypt.compare(password, user.password);

    return user;

};

userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this;

        const token = jwt.sign(
            { _id: this._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "15d",
            },
        );

        if (!token) {
            throw new Error("token not found",404);
        }

        user.tokens = user.tokens.concat({ token });

        await user.save();

        return token;

    } catch (error) {
        throw new Error(error.message,500);
    }
};

const User = mongoose.model("User", userSchema);

export default User;