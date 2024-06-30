import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlewares.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.models.js";
import { invalidateCache, reduceStock } from "../utils/features.js";


export const newOrder = TryCatch(
    async(req:Request<{},{},NewOrderRequestBody>,res,next)=> {


        const {
            orderItems,
            shippingInfo,
            user,
            subtotal,
            discount,
            tax,
            total,
            shippingCharges
        } = req.body;

        await Order.create({
            orderItems,
            shippingInfo,
            user,
            subtotal,
            discount,
            tax,
            total,
            shippingCharges
        });

        await reduceStock(orderItems);
        invalidateCache({product:true,order:true,admin:true});


        res.status(201).json({
            success:true,
            message: "Order Placed Successfully"
        })

    }
)