import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlewares.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.models.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.class.js";
import { myCache } from "../app.js";


export const newOrder = TryCatch(
    async(req:Request<{},{},NewOrderRequestBody>,res,next)=> {


        const {
            orderItems,
            shippingInfo,
            user,
            subTotal,
            discount,
            tax,
            total,
            shippingCharges,

        } = req.body;


        if( !orderItems ||
            !user ||
            !subTotal ||
            !tax ||
            !total || !shippingInfo){
                return next(new ErrorHandler("Please Enter All Fields",400))
            }

        await Order.create({
            orderItems,
            shippingInfo,
            user,
            subTotal,
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


export const myOrders = TryCatch(
    async(req,res,next)=> {

        const {id:user} = req.query;

        let orders=[];

        const key:string = `myOrders-${user}`;

        if(myCache.has(key)){
            orders = JSON.parse(myCache.get(key) as string);
        }else{
            orders = await Order.find({user});
            myCache.set(key,JSON.stringify(orders));
        }

        res.status(201).json({
            success:true,
            orders
        })

    }
)

export const allOrders = TryCatch(
    async(req,res,next)=> {

        const {id:user} = req.query;

        let orders=[];

        const key:string = `allOrders`;

        if(myCache.has(key)){
            orders = JSON.parse(myCache.get(key) as string);
        }else{
            orders = await Order.find({}).populate("user","name");
            myCache.set(key,JSON.stringify(orders));
        }

        res.status(200).json({
            success:true,
            orders
        })

    }
)


export const getSingleOrder = TryCatch(
    async(req,res,next)=> {

        const {id} = req.params; // Product Id
        const key:string = `order-${id}`;

        let order;


        if(myCache.has(key)){
            order = JSON.parse(myCache.get(key) as string);
        }else{
            order = await Order.findById(id).populate("user","name");
            if(!order){
                return next(new ErrorHandler("Order Not Found ", 404));
            }
            myCache.set(key,JSON.stringify(order));
        }

        res.status(200).json({
            success:true,
            order
        })

    }
)

/*
export const processOrder = TryCatch(
    async(req,res,next)=> {

        const {id} = req.params;
        const key:string = `order-${id}`;

        let order  = await Order.findById(id);

        if(!order){

        }


        if(myCache.has(key)){
            order = JSON.parse(myCache.get(key) as string);
        }else{
            order = await Order.findById(id).populate("user","name");
            if(!order){
                return next(new ErrorHandler("Order Not Found ", 404));
            }
            myCache.set(key,JSON.stringify(order));
        }

        res.status(200).json({
            success:true,
            order
        })

    }
)
*/