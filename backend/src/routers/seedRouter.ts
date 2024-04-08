import { UserModel } from './../models/userModel';
import { sampleProducts, sampleUsers } from '../data';
import { ProductModel } from '../models/productModel';
import asyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';


export const seedRouter = express.Router();

seedRouter.get(
    '/',
    asyncHandler(async (_req: Request, res: Response) => {
        await ProductModel.deleteMany({});
        const createdProducts = await ProductModel.insertMany(sampleProducts)

        await UserModel.deleteMany({});
        const createdUsers = await UserModel.insertMany(sampleUsers)


        res.json({ createdProducts, createdUsers })
    })
)