import express from "express";
import BlogController from "../controller/Blog.controller.js";
import validate from "../middleware/validate.js";
import BlogSchema from "../validation/Blog.Schema.js";
import {updateBlogSchema} from "../validation/Blog.Schema.js"
import {BlogUploads} from "../middleware/uploads.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js"

const router = express.Router();

router.post("/" , auth , checkRole("admin") , BlogUploads.single("coverImage") , validate(BlogSchema) , BlogController.addBlog);

router.get("/:id" , auth , checkRole("admin") , BlogController.getById);

router.get("/" , auth , checkRole("admin") , BlogController.getAll);

router.patch("/:id" , auth ,  checkRole("admin") , BlogUploads.single("coverImage") , validate(updateBlogSchema) , BlogController.updateBlog);

router.delete("/:id" , auth , checkRole("admin") , BlogController.deleteBlog);

export default router; 