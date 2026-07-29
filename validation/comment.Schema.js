import joi from "joi";

const CommentSchema = joi.object({

    content: joi.string().trim().min(3).max(50).required().messages({
         "string.base":"content must be in string",
         "string.empty":"content can not be empty",
         "string.min":"content is minimum 3 charachter long",
         "string.max":"content is maximum 50 charachter long",
         "any.required":"content is required"
    }),

});

export default CommentSchema;