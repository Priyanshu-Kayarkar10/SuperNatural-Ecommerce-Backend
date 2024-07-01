import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
    _id: string;
    name: string;
    photo: string;
    email: string;
    gender: string;
    role: string;
    dob: Date;
}

export interface NewProductRequestBody {
    name: string;
    photo: string;
    stock: number;
    price: number;
    category: string
}

export type SearchRequestQuery = {
    search?:string;
    category?: string;
    price?: string;
    sort?:string;
    page?:string
}

export interface BaseQuery{
    name?: {
        $regex: string;
        $options:string;
    };
    price?: {
        $lte: number;
    },
    category?:string,


}

export type ControllerType = (
    req: Request<any>,
    res: Response,
    next : NextFunction
) => Promise<void | Response<any, Record<string,any>> >


export type InvalidateCacheProps = {
    product?:boolean;
    order?:boolean;
    admin?: boolean;
}


export type OrderItem = {
    name: string;
    photo: string;
    price: string;
    quantity: number;
    productId: string;
}
export type ShippingInfoType = {
    address: string;
    city: string;
    piCode: number;
    country: string;
    state: string;
}

export interface NewOrderRequestBody{
    shippingInfo: ShippingInfoType;
    user: string;
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItem[]
}