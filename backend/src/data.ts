import bcript from 'bcryptjs';
import { User } from "./models/userModel.js";
import { Product } from "./models/productModel";

export const sampleProducts: Product[] = [
    {
        name: 'Aguacate love',
        slug: 'aguacate-love',
        category: 'crochet',
        image: '/src/assets/images/CORO-crochet/1.jpg',
        price: 120,
        countInStock: 10,
        brand: 'Mis cositas de crochet',
        rating: 1.5,
        numReviews: 10,
        description: 'Pareja de aguacates confeccionados de forma artesanal'
    },

    {
        name: 'Patines',
        slug: 'patines',
        category: 'crochet',
        image: '/src/assets/images/CORO-crochet/2.jpg',
        price: 70,
        countInStock: 10,
        brand: 'Mis cositas de crochet',
        rating: 4.5,
        numReviews: 10,
        description: 'Patines de rampa con bota desmontable y ruedas que giran'
    },

    {
        name: 'Hermanas',
        slug: 'hermanas',
        category: 'crochet',
        image: '/src/assets/images/CORO-crochet/3.jpg',
        price: 150,
        countInStock: 10,
        brand: 'Mis cositas de crochet',
        rating: 2.5,
        numReviews: 10,
        description: 'Pareja de muñecas en dos tamañas diferentes'
    },
    {
        name: 'Taller de costura',
        slug: 'taller-de-costura',
        category: 'miniaturas',
        image: '/src/assets/images/miniaturas/m3.jpg',
        price: 150,
        countInStock: 0,
        brand: 'El mundo en miniatura',
        rating: 5,
        numReviews: 10,
        description: 'Taller de costura'
    },
    {
        name: 'Pendientes Pavo Real',
        slug: 'pendientes-pavo-real',
        category: 'joyas',
        image: '/src/assets/images/joyas/j1.jpg',
        price: 150,
        countInStock: 10,
        brand: 'Complementos',
        rating: 4,
        numReviews: 10,
        description: 'Pendientes de perla calibrada con motivo pluma pavo real'
    }
]

export const sampleUsers: User[] = [
    {
        name: 'Veronika',
        email: 'vero1@test.com',
        password: bcript.hashSync('123456'),
        isAdmin: true,
    },
    {
        name: 'Kanko',
        email: 'kanko@test.com',
        password: bcript.hashSync('123456'),
        isAdmin: false,
    }
]
