import express from "express";
import { newOrder } from "../controllers/oder.controllers.js";
const app = express.Router();
app.post("/new", newOrder);
// app.get("/all",adminOnly,getAllUser)
// app.route("/:id")
// .get(adminOnly,getUser)
// .delete(adminOnly,deleteUser)
export default app;
