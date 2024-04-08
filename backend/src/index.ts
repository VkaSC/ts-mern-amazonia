import { keyRouter } from './routers/keyRouter';
import { orderRouter } from './routers/orderRouter';
import { seedRouter } from './routers/seedRouter';
import { productRouter } from './routers/productRouter';
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose';
import path from 'path'
import { userRouter } from './routers/userRouter';
import app from './app';

dotenv.config();

const MONGODB_URL =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/artesaniadb';

mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log('connected to mongodb')
        const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)
        app.listen(PORT, () => {
            console.log(`server started at http://localhost:${PORT}`)
        });

    })
    .catch(() => {
        console.log('error mongodb')
    })





