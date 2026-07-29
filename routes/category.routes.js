import express from "express";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import categoryController from "../controller/category.controller.js";
import validate from "../middleware/validate.js";
import categorySchema from "../validation/category.Schema.js";
import {updateCategoryShcema} from "../validation/category.Schema.js"


const router = express.Router();

router.post("/" , auth , checkRole("admin") , validate(categorySchema) , categoryController.addCategory);

router.get("/" , auth , checkRole("admin") , categoryController.getAll)

router.patch("/:id" , auth , checkRole("admin") , validate(updateCategoryShcema) , categoryController.updateCategory);

router.delete("/:id" ,  auth , checkRole("admin") , categoryController.deleteCategory);

export default router;