import { Product } from "../models/product.models.js";
import { TryCatch } from "../middlewares/error.middlewares.js";
import { ErrorHandler } from '../utils/utility.class.js';
import { rm } from 'fs';
import { myCache } from '../app.js';
import { invalidateCache } from '../utils/features.js';
// import {faker} from '@faker-js/faker'
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, category, stock, price } = req.body;
    const photo = req.file;
    // let product = await Product.findById(_id);
    // if(product) {
    //     return res.status(200).json({
    //     success:true,
    //     message: ` Product Already Exists ${product} `
    // })}
    if (!photo) {
        return next(new ErrorHandler("Please Add Photo", 400));
    }
    if (!name || !category || !stock || !price) {
        rm(photo.path, () => {
            console.log("Deleted");
        });
        return next(new ErrorHandler("Please Add All Fields", 400));
    }
    const product = await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        photo: photo?.path,
        stock,
    });
    await invalidateCache({ product: true });
    return res.status(201).json({
        success: true,
        message: " Product Created Successfully",
        product
    });
});
export const getAllProduct = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("allProducts")) {
        products = JSON.parse(myCache.get("allProducts"));
    }
    else {
        products = await Product.find({});
        myCache.set("allProducts", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products
    });
});
export const getProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product) {
            return next(new ErrorHandler("Product Not Found", 400));
        }
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    rm(product.photo, () => {
        console.log('Product Photo Delelted');
    });
    await product?.deleteOne();
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});
// Revalidate on New,Update,Delete, Product & on New Order
export const getLastestProduct = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("latestProducts")) {
        products = JSON.parse(myCache.get("latestProducts"));
    }
    else {
        products = await Product.find({}).sort({
            createdAt: -1
        }).limit(5);
        myCache.set("latestProducts", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        message: " Latest Products",
        products
    });
});
// Revalidate on New,Update,Delete, Product & on New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        categories = myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(201).json({
        success: true,
        message: " List of Categories ",
        categories
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    let product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Invalid Product Id", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log(' Old Photo Deleted');
        });
        // await Product.findByIdAndUpdate(id, req.file, {
        //     new: true,
        //     runValidators: true,
        //     useFindAndModify: false,
        //   });
        product.photo = photo.path;
    }
    product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: " Product Updated Successfully",
        product
    });
});
export const searchProduct = TryCatch(async (req, res, next) => {
    const { category, price, search, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i"
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price)
        };
    if (category)
        baseQuery.category = category;
    const productPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredProduct] = await Promise.all([
        productPromise,
        Product.find(baseQuery)
    ]);
    const totalPage = Math.ceil(filteredProduct.length / limit);
    return res.status(201).json({
        success: true,
        message: " Product Fined Successfully",
        products,
        totalPage
    });
});
// const generateRandomProducts = async(count:number = 10) => {
//     const products = [];
//     for(let i = 0; i < count;i++){
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "uploads\\1423ff4e-eb3a-4e6b-932e-dc792a967719.jpg",
//             price: faker.commerce.price({min: 1500,max:100000,dec:0}),
//             stock: faker.commerce.price({min:1,max:100,dec:0}),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v:0,
//         }
//         products.push(product);
//     }
//     await Product.create(products);
//     console.log({success:true});
// }
// const deleteRandomProducts = async(count:number=10) => {
//     const products = await Product.find({}).skip(2);
//     for(let i = 0; i < products.length;i++){
//         const product = products[i]
//         await product.deleteOne();
//     }
//     console.log({success: true,message:`${count} products deleted successfully`});
// }
// deleteRandomProducts(1)
// generateRandomProducts(40);
