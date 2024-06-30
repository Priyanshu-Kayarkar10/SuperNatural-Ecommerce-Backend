import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.models.js";
import { ErrorHandler } from "./utility.class.js";
export const connectDB = async () => {
    try {
        const DB = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("MONGO DB CONNECTED", DB.connection.host);
    }
    catch (error) {
        console.log(`MONGODB connection error : ${error}`);
    }
};
export const invalidateCache = async ({ admin, order, product }) => {
    if (product) {
        const productKeys = [
            "latestProducts",
            "categories",
            "allProducts", //product-${id}
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) {
            throw new ErrorHandler("Product Not Found", 404);
        }
        product.stock -= order.quantity;
        await product.save();
    }
};
