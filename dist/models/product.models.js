import mongoose from "mongoose";
const schema = new mongoose.Schema({
    photo: {
        type: String,
        required: [true, "Please Upload the photo"]
    },
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Stock"]
    },
    category: {
        type: String,
        required: [true, "Please Enter Category"],
        trim: true
    }
}, {
    timestamps: true
});
export const Product = mongoose.model("Product", schema);
