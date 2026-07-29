import Joi from "joi";

const BlogSchema = Joi.object({

    title: Joi.string().trim().min(3).max(100).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title must not exceed 100 characters",
        "any.required": "Title is required"
    }),

    slug: Joi.string().trim().lowercase().min(5).max(100).required().messages({
        "string.base": "Slug must be a string",
        "string.empty": "Slug cannot be empty",
        "string.min": "Slug must be at least 5 characters long",
        "string.max": "Slug must not exceed 100 characters",
        "any.required": "Slug is required"
    }),

    content: Joi.string().trim().min(10).max(10000).required().messages({
        "string.base": "Content must be a string",
        "string.empty": "Content cannot be empty",
        "string.min": "Content must be at least 10 characters long",
        "string.max": "Content must not exceed 10000 characters",
        "any.required": "Content is required"
    }),

    excerpt: Joi.string().trim().min(10).max(300).required().messages({
        "string.base": "Excerpt must be a string",
        "string.empty": "Excerpt cannot be empty",
        "string.min": "Excerpt must be at least 10 characters long",
        "string.max": "Excerpt must not exceed 300 characters",
        "any.required": "Excerpt is required"
    }),

    category: Joi.string().trim().required().messages({
        "string.base": "Category must be a string",
        "string.empty": "Category cannot be empty",
        "any.required": "Category is required"
    }),

    tags: Joi.string().trim().min(1).required().messages({
        "string.base": "Tags must be a string",
        "string.empty": "Tag cannot be empty",
        "string.min": "Tag must contain at least 1 character",
        "any.required": "Tag is required"
    }),

    status: Joi.string().valid("draft", "published").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'draft' or 'published'"
    })

});

export const updateBlogSchema = BlogSchema

.fork(["title", "slug","excerpt", "content", "category", "tags","status"],(field)=> field.optional())
// .fork(["author", "coverImage", "cloudinary_id"],(field)=> field.forbidden().messages({"any.unknown":"This field can not be updated"}))
.or("title", "slug","excerpt", "content", "category", "tags","status");

export default BlogSchema;