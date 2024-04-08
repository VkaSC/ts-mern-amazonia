import { Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { Product } from "../types/Product.js"
import { useContext } from 'react'
import { Store } from "../Store.js"
import Rating from "./Rating.js"
import { CartItem } from "../types/Cart.js"
import { convertProductToCartItem } from "../utils.js"
import { toast } from "react-toastify"

function ProductItem({ product }: { product: Product }) {
    const { state, dispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const addToCartHandle = (item: CartItem) => {

        const existItem = cartItems.find((x) => x._id === product._id);

        const quantity = existItem ? existItem.quantity + 1 : 1;
        if (product.countInStock < quantity) {
            alert('Lo sentimos, el producto se encuentra fuera de stock')
            return
        };
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
        toast.success('El producto ha sido añadido al carrito');
    };

    return (
        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className="card-img-top" alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>{product.price}€</Card.Text>
                {product.countInStock === 0 ? (
                    <Button variant="light" disabled>
                        Sin Stock
                    </Button>
                ) : (
                    <Button onClick={() => addToCartHandle(convertProductToCartItem(product))}>Añadir al carrito</Button>
                )}
            </Card.Body>
        </Card>
    )
}
export default ProductItem
