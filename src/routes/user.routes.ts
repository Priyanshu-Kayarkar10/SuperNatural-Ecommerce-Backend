import express from "express";
import {deleteUser, getAllUser, getUser, newUser} from "../controllers/user.controllers.js"
import { adminOnly } from "../middlewares/auth.middlewares.js";

const app = express.Router();



app.post("/new",newUser)


app.get("/all",adminOnly,getAllUser)

app.route("/:id")
.get(adminOnly,getUser)
.delete(adminOnly,deleteUser)

export default app;