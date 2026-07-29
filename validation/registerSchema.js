import Joi from "joi";

const registerSchema = Joi.object({

    name: Joi.string().min(1).max(15).required().messages({
        "string.base":"name must be in string",
        "string.min":"name is minimum 1 charachter long",
        "string.max":"name is maximum 15 charachter long",
        "any.required":"name is required",
    }),

    email: Joi.string().email().required().messages({
        "string.base":"email must be in string",
        "string.email":"please valid enter email",
        "any.required":"email is required",
    }),

    password: Joi.string().min(5).max(25).required().messages({
        "string.base":"password must be in string",
        "string.min":"password is minimum 5 charachter long",
        "string.max":"password is maximum 25 charachter long",
        "any.required":"password is required",
    }),

    phone: Joi.string().min(10).pattern(/^[0-9]{10}$/).required().messages({
        "string.pattern.base":" phone must be in 10 digits",
        "any.required":"phone is required",
    }),

    address: Joi.string().min(3).max(50).required().messages({
        "string.base":"address must be in string",
        "string.min":"address is minimum 3 charachter long",
        "string.max":"address is maximum 50 charachter long",
        "any.required":"address is required",
    }),
});

export const updateSchema = registerSchema

.fork(["name","phone","address"], (field)=> field.optional())
.fork(["email","password"], (field)=> field.forbidden().messages({"any.unknown":" This field can not updated"}))
.or("name","phone","address");

export default registerSchema ;