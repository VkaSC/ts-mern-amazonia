import { generateToken } from './../utils';
import bcript from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';
import { User, UserModel } from '../models/userModel';

export const userRouter = express.Router();

//POST/api/users/signin
userRouter.post(
    '/signin',
    asyncHandler(async (req: Request, res: Response) => {
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            if (bcript.compareSync(req.body.password, user.password)) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user),
                })
                return
            }
        }
        res.status(401).json({ message: 'Email o password incorrectos' })
    })
)

userRouter.post(
    '/signup',
    asyncHandler(async (req: Request, res: Response) => {
        const user = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: bcript.hashSync(req.body.password),
        } as User)
        res.json({
            _id: user._id,
            mane: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
        })
    })
)
