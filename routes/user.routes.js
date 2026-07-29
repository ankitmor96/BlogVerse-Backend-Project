import express from "express";
import userController from "../controller/user.controller.js";
import auth from "../middleware/auth.js";
import uploads from "../middleware/uploads.js";
import validate from "../middleware/validate.js";
import registerSchema from "../validation/registerSchema.js";
import { updateSchema } from "../validation/registerSchema.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.post("/" , uploads.single("ProfileImage") , validate(registerSchema) , userController.add);

router.post("/login", userController.login);

router.post("/me" , auth , userController.authLogin);

router.patch("/me" , auth , uploads.single("ProfileImage") , validate(updateSchema) , userController.Update);

router.get("/" , auth , checkRole("admin") ,userController.getAll);

router.get("/:id/blogs" , auth , checkRole("admin") ,userController.getUserBlogs);

router.get("/:id/blogs", auth , checkRole("admin","user"), userController.getUserComment);

router.delete("/me" , auth ,userController.Delete); 

export default router;