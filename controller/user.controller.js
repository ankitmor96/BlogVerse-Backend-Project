import HttpError from "../middleware/HttpError.js";
import User from "../model/user.model.js";
import uploads from "../middleware/uploads.js";
import cloudinary from "../config/cloudinary.js";


const add = async (req, res, next) => {
    try {

        const { name, email, password, phone, address, role } = req.body;

        const newUser = new User({
            name,
            email,
            password,
            phone,
            address,
            role,
            ProfileImage: req.file?.path || null,
            cloudinary_id: req.file?.filename || null
        });

        const alreadyUser = await User.findOne({ email });

        if (alreadyUser) {
            return next(new HttpError("User already exists", 400));
        }

        await newUser.save();

        console.log(newUser);

        res.status(201).json({
            success: true,
            message: "new user add successFully",
            data: newUser
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const userLogin = await User.findByCredentials(email, password);

        if (!userLogin) {
            return next(new HttpError("user data not found", 404));
        }

        const token = await userLogin.generateAuthToken();

        console.log(token);

        res.status(200).json({
            success: true,
            message: "user login successFully",
            token,
            data: userLogin,
        });


    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const authLogin = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return next(new HttpError("user data not found", 400));
        }

        res.status(200).json({
            success: true,
            message: "user authLogin successFully",
            user
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const Update = async (req, res, next) => {
    try {

        const user = req.user;

        const updates = Object.keys(req.body || {});

        const allowedFields = ["name", "password", "phone", "address"];

        const isValidUpdates = updates.every((field) =>
            allowedFields.includes(field));

        if (!isValidUpdates) {
            return next(new HttpError("please allowedFields is updates", 404));
        }

        updates.forEach((field) => {
            user[field] = req.body[field]
        });

        if (req.file) {
            if (cloudinary_id) {

                await cloudinary.uploader.destroy(user.cloudinary_id)
            }

            user.ProfileImage = req.file?.path || null,
                user.cloudinary_id = req.file?.filename || null
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: " allowed field update successFully",
            user
        });


    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getAll = async (req, res, next) => {
    try {

        const user = await User.find({});

        if (!user) {
            return next(new HttpError("user not found", 404));
        }

        res.status(200).json({
            success: true,
            message: " All user data found",
            user
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getUserBlogs = async (req, res, next) => {
    try {

        const id = req.params.id || req.user._id;

        const user = await User.findById(id).populate("Blogs");

        if (!user) {
            return next(new HttpError("user not found", 404));
        }

        console.log("Blog :", user.Blogs);

        res.status(200).json({
            success: true,
            message: "user blogs fetched successFully",
            data: user
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getUserComment = async (req, res, next) => {
    try {

        const id = req.params.id;

        const user = await User.findById(id).populate({
            path: "Comments",
            populate: {
                path: "blog",
                select: "title slug"
            },
        });

        if (!user) {
            return next(new HttpError("user not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "user comment and blog data fetched successFully",
            data: user
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const Delete = async (req, res, next) => {
    try {

        const user = req.user;

        await user.deleteOne(user);

        res.status(200).json({
            success: true,
            message: " delete successFully",
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};


export default { add, login, authLogin, Update, getAll, getUserBlogs , getUserComment , Delete };