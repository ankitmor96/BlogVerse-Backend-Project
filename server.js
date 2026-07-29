import express from "express";
import HttpError from "./middleware/HttpError.js";
import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import BlogRouets from "./routes/Blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import commentRoutes from "./routes/comment.routes.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

app.use("/blogs", BlogRouets);

app.use("/categories" , categoryRoutes);

app.use("/comments" , commentRoutes);

app.get("/", (req, res, next) => {
    res.send("hello from server");
});

app.use((req, res, next) => {
    return next(new HttpError("route not found", 404));
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.statusCode || 500).json({
        message: error.message || "internal server error"
    });
});

const StartServer = async (req, res, next) => {
    try {
        const port = process.env.PORT || 5000;

        await ConnectDB();

        app.listen(port, (error) => {
            if (error) {
                console.log(error);
            }
            console.log(`server has runing on port ${port}`);
        });

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

StartServer();

// const virtualBlog = async () => {
//     try {

//         const user = await User.findById(id).populate("Blogs");

//         console.log(user);
//         console.log("Blog :", user.Blogs );

//     } catch (error) {
//         console.log(error.message);
//     }

// };

// virtualBlog();


