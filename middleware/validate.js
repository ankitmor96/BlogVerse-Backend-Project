import HttpError from "./HttpError.js";

// ✅ validate middleware — properly fixed
const validate = (Schema) => (req, res, next) => {

    const { error } = Schema.validate(req.body, {
        abortEarly: true,
        allowUnknown: false   // ✅ "allowUnkown" typo fix
    });

    if (error) {
        // ✅ throw ni jagye next() use karyu — Express error handler proper kaam karse
        return next(new HttpError(error.details[0].message, 400));
    }

    next();
};

export default validate;
