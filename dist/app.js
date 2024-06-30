import express from 'express';
import { connectDB } from './utils/features.js';
// import {ErrorRequestHandler,Request,Response,} from 'express'
import NodeCache from 'node-cache';
//
// Imported Routes
import userRoute from './routes/user.routes.js';
import productRoute from './routes/product.routes.js';
import OderRoute from "./routes/oder.routes.js";
import { errorMiddleware } from './middlewares/error.middlewares.js';
import { config } from 'dotenv';
import morgan from 'morgan';
config({
    path: "./.env",
});
export const myCache = new NodeCache();
const app = express();
// middlewares
app.use(express.json());
app.use(morgan("dev"));
// Routes
app.get("/", (req, res) => {
    res.send("WELCOME TO SUPERNATURAL BACKEND");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", OderRoute);
// end middleware
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Listening on PORT : ${PORT}`);
    });
}).catch(() => {
    console.log(`MONGO DB CONNECTION ERROR`);
    process.exit(1);
});
