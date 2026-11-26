import mongoose from "mongoose";
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
        unique: true  // ✅ "uniuqe" typo fix
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
    ProfileImage: {
        type: String,
        default: null
    },
    isverified: {
        type: Boolean,
        default: false
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
);

userSchema.virtual("Blogs", {
    ref: "Blogger",
    localField: "_id",
    foreignField: "author"
});

userSchema.virtual("Comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "user"
});

userSchema.pre("save", async function () {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(this.password, 10);
    }
});

// ✅ findByCredentials — password check fix
userSchema.statics.findByCredentials = async function (email, password) {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("This user not found");
    }

    // ✅ password compare karo — pehla nahi karto hto
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid password");
    }

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

        user.tokens = user.tokens.concat({ token });

        await user.save();

        return token;

    } catch (error) {
        throw new Error(error.message);
    }
};

const User = mongoose.model("User", userSchema);

export default User;
