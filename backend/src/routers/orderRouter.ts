import { Product } from './../models/productModel';
import { Order, OrderModel } from './../models/orderModel';
import asyncHandler from 'express-async-handler';
import express, { Request, Response } from 'express';
import { isAuth } from '../utils';

export const orderRouter = express.Router();


orderRouter.get(
    '/mine',
    isAuth,
    asyncHandler(async (req: Request, res: Response) => {
        const orders = await OrderModel.find({ user: req.user._id })
        res.json(orders)
    })
)

orderRouter.get( // /api/order/:id
    '/:id',
    isAuth,
    asyncHandler(async (req: Request, res: Response) => {
        const order = await OrderModel.findById(req.params.id)
        if (order) {
            res.json(order)
        } else {
            res.status(404).json({ message: 'No se ha encontrado pedido' })
        }
    })
)

orderRouter.post(
    '/',
    isAuth,
    asyncHandler(async (req: Request, res: Response) => {
        if (req.body.orderItems.length === 0) {
            res.status(400).json({ message: 'Cart is empty' })
        } else {
            const createdOrder = await OrderModel.create({
                orderItems: req.body.orderItems.map((x: Product) => ({
                    ...x,
                    product: x._id,
                })),
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user._id,
            } as Order)
            res.status(201).json({ message: 'Order Created', order: createdOrder })
        }
    })
)

//se hace cuando el pago en paypal se ha realizado para actualizar el pedido
orderRouter.put(
    '/:id/pay',
    isAuth,
    asyncHandler(async (req: Request, res: Response) => {
        const order = await OrderModel.findById(req.params.id)

        if (order) {
            order.isPaid = true
            order.paidAt = new Date(Date.now())
            //datos de paypal api
            order.paymentResult = {
                paymentId: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            }
            const updateOrder = await order.save()

            res.send({ order: updateOrder, message: 'El pago se ha realizado correctamente' })
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' })
        }
    })
)
