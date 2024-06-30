import mongoose from "mongoose";

interface IProduct extends Document{
    price: number;
    name: string;
    photo: string;
    createdAt:Date;
    updatedAt: Date;
    stock: number;
    category: string
}


const schema = new mongoose.Schema(
    {
        photo: {
            type: String,
            required: [true,"Please Upload the photo"]
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
            required: [true,"Please Enter Stock"]
        },
        category: {
            type: String,
            required: [true,"Please Enter Category"],
            trim: true
        }

},{
    timestamps: true
}
)

export const Product = mongoose.model<IProduct>("Product",schema)
