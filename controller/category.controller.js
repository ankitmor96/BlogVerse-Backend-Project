import HttpError from "../middleware/HttpError.js";
import category from "../model/category.model.js";

const getCategoryBlog = async (req, res, next) => {
    try {

        const { id } = req.params;

        const Category = await category.findById(id).populate("Blogs");

        if (!Category) {
            return next(new HttpError("category not found", 404));
        }

        console.log("Blogs :", Category.Blogs);

        res.status(200).json({
            success: true,
            message: "category blogs fetched successFully",
            data: Category
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const addCategory = async (req, res, next) => {
    try {

        const { categoryName, description } = req.body;

        const existingCategory = await category.findOne({ categoryName });

        if (existingCategory) {
            return next(new HttpError("This category already exists", 404));
        }

        const newCategory = await category.create({
            categoryName,
            description
        });

        res.status(201).json({
            success: true,
            message: "new category add successFully",
            data: newCategory
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const getAll = async(req,res,next)=>{
    try{

        const Category = await category.find();

        if(Category.length === 0){
            return next(new HttpError("category not found",404));
        }

        res.status(200).json({
            success: true,
            message: "All category data fetched successFully",
            data: Category
        });

    }catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const updateCategory = async (req, res, next) => {
    try {

        const TargetUpdate = req.params.id || req.user._id;

        const Category = await category.findById(TargetUpdate);

        if(!Category){
            return next (new HttpError("category not found",404));       
        }

        const updates = Object.keys(req.body);

        const allowedFields = ["categoryName", "description"];

        const isValidUpdate = updates.every((field) =>
            allowedFields.includes(field));

        if (!isValidUpdate) {
            return next(new HttpError("update field not found", 404));
        }

        updates.forEach((update)=>{
            Category[update] = req.body[update];
        });

        await Category.save();

        res.status(200).json({
            success:true,
            message:" category update successFully",
            Category
        });


    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const deleteCategory = async(req,res,next)=>{
    try{

        const id = req.params.id || req.user.id;

        const Category = await category.findById(id);

        if(!Category){
            return next(new HttpError("category not found",404));
        }

        await Category.deleteOne();

        res.status(200).json({
            success: true,
            message: "delete category successFully",
        });

    }catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

export default { getCategoryBlog, addCategory , getAll , updateCategory , deleteCategory };