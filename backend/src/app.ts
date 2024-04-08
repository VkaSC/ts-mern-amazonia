import { keyRouter } from './routers/keyRouter';
import { orderRouter } from './routers/orderRouter';
import { seedRouter } from './routers/seedRouter';
import { productRouter } from './routers/productRouter';
import cors from 'cors'
import express, { Request, Response } from 'express'
import path from 'path'
import { userRouter } from './routers/userRouter';

const app = express();
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:5173']
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/seed', seedRouter);
app.use('/api/keys', keyRouter);

//Serv FE a traves del BE
// '../../frontend/dist' => Archivo de destino en el FE
app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})


export default app;