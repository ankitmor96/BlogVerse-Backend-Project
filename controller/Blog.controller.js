import Blogger from "../model/Blog.model.js";
import HttpError from "../middleware/HttpError.js";
import cloudinary from "../config/cloudinary.js";

const addBlog = async (req, res, next) => {
    try {

        const { title, slug, content, excerpt, category, tags, status } = req.body;

        if (!req.file) {
            return next(new HttpError("cover image not found", 400));
        }

        const existingBlog = await Blogger.findOne({ slug });

        if (existingBlog) {
            return next(new HttpError("slug already exists", 400));
        }

        const newBlog = await Blogger.create({
            title,
            slug,
            content,
            excerpt,
            category,
            tags: [tags],
            status,
            coverImage: req.file?.path || null,
            cloudinary_id: req.file?.filename || null,
            author: req.user._id  // Relationship in user by blog modal
        });

        res.status(201).json({
            success: true,
            message: "new Blog add successFully",
            data: newBlog
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getById = async (req, res, next) => {
    try {

        const { id } = req.params;

        const Blog = await Blogger.findById(id);

        if (!Blog) {
            return next(new HttpError("blog id not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successFully",
            data: Blog
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getAll = async (req, res, next) => {
    try {

        const Blogs = await Blogger.find({});

        if (Blogs.length === 0) {
            return next(new HttpError("blog not found", 404));
        }

        res.status(200).json({
            success: true,
            message: " All Blog fetched successFully",
            data: Blogs
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const updateBlog = async (req, res, next) => {
    try {

        const Updates = req.params.id || req.Blog._id;

        const Blog = await Blogger.findById(Updates);

        if (!Blog) {
            return next(new HttpError("Blog not found", 404));
        }

        const updates = Object.keys(req.body);

        let allowedFields = ["title", "slug", "excerpt", "content", "category", "tags", "status"];

        if (req.user.role === "admin") {
            allowedFields = [...allowedFields, "isVerified"];
        }

        const isValidUpdates = updates.every((field) =>
            allowedFields.includes(field));

        if (!isValidUpdates) {
            return next(new HttpError("Invalid update fields", 404));
        }

        updates.forEach((update) => {
            Blog[update] = req.body[update];
        });

        if (req.file) {
            if (Blog.cloudinary_id) {

                await cloudinary.uploader.destroy(Blog.cloudinary_id);

            }

            Blog.coverImage = req.file.path;
            Blog.cloudinary_id = req.file.filename;
        }

        await Blog.save();

        res.status(200).json({
            success: true,
            message: "Blog update successFully",
            data: Blog
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getBlogComment = async (req, res, next) => {
    try {

        const id = req.params.id;

        const blog = await Blogger.findById(id).populate({
            path: "Comments",
            populate: {
                path: "user",
                select: "name email phone role"
            },
        });

        if (!blog) {
            return next(new HttpError("user not found", 404));
        }


        res.status(200).json({
            success: true,
            message: "blog comment and user data fetched successFully",
            data: blog
        });

    } catch (error) {
        return next(new HttpError(error.messahe, 500));
    }
};


const deleteBlog = async (req, res, next) => {
    try {

         const {id} = req.params;

        const Blog = await Blogger.findById(id);


        if (!Blog) {
            return next(new HttpError("blog not found", 404));
        }

        if (Blog.cloudinary_id) {
            await cloudinary.uploader.destroy(Blog.cloudinary_id);
        }

         await Blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog delete successFully",
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

export default { addBlog, getById, getAll, updateBlog, deleteBlog };