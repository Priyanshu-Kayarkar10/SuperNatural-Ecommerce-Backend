import express from "express";
import { deleteProduct, getAllCategories, getAllProduct, getLastestProduct, getProduct, newProduct, searchProduct, updateProduct } from "../controllers/product.controllers.js";
import { adminOnly } from "../middlewares/auth.middlewares.js";
import { singleUpload } from "../middlewares/multer.middlewares.js";
const app = express.Router();
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/admin-products", adminOnly, getAllProduct);
app.get("/latest", getLastestProduct);
app.get("/categories", getAllCategories);
app.get("/all", searchProduct);
app.route("/:id")
    .get(getProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;
