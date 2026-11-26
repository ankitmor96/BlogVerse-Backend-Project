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
            tags: Array.isArray(tags) ? tags : [tags],
            status,
            coverImage: req.file?.path || null,
            cloudinary_id: req.file?.filename || null,
            author: req.user._id
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

        const blog = await Blogger.findById(id);

        if (!blog) {
            return next(new HttpError("blog id not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successFully",
            blog  // ✅ "blog" key — frontend ma data.blog
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getAll = async (req, res, next) => {
    try {

        let {
            page = 1,
            limit = 10,
            search,
            category,
            status,
            sort = "createdAt",
            order = "desc",
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        const sortOption = {
            [sort]: order === "asc" ? 1 : -1
        };

        const totalBlog = await Blogger.countDocuments(filter);

        const blogs = await Blogger
            .find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        // ✅ return umero — double response no crash fix
        if (blogs.length === 0) {
            return res.status(200).json({
                success: true,
                message: "blog data not found",
                blogs: []
            });
        }

        res.status(200).json({
            success: true,
            message: "all Blog data fetched successFully",
            totalBlog,
            totalpages: Math.ceil(totalBlog / limit),
            currentPage: page,
            blogs  // ✅ hve _id, coverImage, category, status badhu aashe
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const updateBlog = async (req, res, next) => {
    try {

        // ✅ req.Blog._id → req.params.id fix
        const blogId = req.params.id;

        const blog = await Blogger.findById(blogId);

        if (!blog) {
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
            return next(new HttpError("Invalid update fields", 400));
        }

        updates.forEach((update) => {
            blog[update] = req.body[update];
        });

        if (req.file) {
            if (blog.cloudinary_id) {
                await cloudinary.uploader.destroy(blog.cloudinary_id);
            }
            blog.coverImage = req.file.path;
            blog.cloudinary_id = req.file.filename;
        }

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog update successFully",
            data: blog
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
            return next(new HttpError("blog not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "blog comment and user data fetched successFully",
            data: blog
        });

    } catch (error) {
        // ✅ error.messahe typo fix → error.message
        return next(new HttpError(error.message, 500));
    }
};

const deleteBlog = async (req, res, next) => {
    try {

        const { id } = req.params;

        const blog = await Blogger.findById(id);

        if (!blog) {
            return next(new HttpError("blog not found", 404));
        }

        if (blog.cloudinary_id) {
            await cloudinary.uploader.destroy(blog.cloudinary_id);
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog delete successFully",
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

export default { addBlog, getById, getAll, updateBlog, deleteBlog, getBlogComment };
