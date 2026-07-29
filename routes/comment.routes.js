import express from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import commentController from "../controller/comment.controller.js";
import CommentSchema from "../validation/comment.Schema.js"

const router = express.Router();

router.post("/blogs/:id" , auth , validate(CommentSchema) , commentController.addComment);

export default router;