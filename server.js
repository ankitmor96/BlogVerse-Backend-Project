import express from "express";
import HttpError from "./middleware/HttpError.js";
import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import BlogRouets from "./routes/Blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();

// ✅ CORS fix — all origins allow (development mate)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: false
}));

app.use(express.json());

app.use("/users", userRoutes);
app.use("/blogs", BlogRouets);
app.use("/categories", categoryRoutes);
app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
    res.send("BlogVerse Server is Running!");
});

// 404 handler
app.use((req, res, next) => {
    return next(new HttpError("route not found", 404));
});

// Global error handler
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "internal server error"
    });
});

const StartServer = async () => {
    try {
        const port = process.env.PORT || 5000;
        await ConnectDB();
        app.listen(port, () => {
            console.log(`server has runing on port ${port}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

StartServer();
