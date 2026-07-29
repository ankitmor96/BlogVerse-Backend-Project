import joi from "joi";

const categorySchema = joi.object({
    categoryName: joi.string().min(3).max(20).required().messages({
        "string.base": "categoryName is must be in string",
        "string.min": "categoryName is minimum 3 charachter long",
        "string.max": "categoryName is maximum 20 charachter long",
        "any.required": "categoryName is required"
    }),

    description: joi.string().min(5).max(50).required().messages({
        "string.base":"description must be in string",
        "string.min":"description is minimum 5 charachter long",
        "string.max":"description is maximum 50 charachter long",
        "any.required":"description is required"
    }),

});

export const updateCategoryShcema = categorySchema
.fork(["categoryName","description"], (field)=> field.optional())
.or("categoryName","description");

export default categorySchema;

