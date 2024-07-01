import express from "express";
import { adminOnly } from "../middlewares/auth.middlewares.js";
import { allOrders, getSingleOrder, myOrders, newOrder } from "../controllers/oder.controllers.js";
const app = express.Router();
app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/all", adminOnly, allOrders);
app.route("/:id").get(getSingleOrder);
// app.get("/all",adminOnly,getAllUser)
// app.route("/:id")
// .get(adminOnly,getUser)
// .delete(adminOnly,deleteUser)
export default app;
