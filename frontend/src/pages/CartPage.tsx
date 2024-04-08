import { useContext } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MessageBox from "../components/MessageBox.js";
import { Store } from "../Store.js";
import { CartItem } from "../types/Cart.js";

export default function CartPage() {
    const navigate = useNavigate();

    const {
        state: {
            mode,
            cart: { cartItems },
        },
        dispatch,
    } = useContext(Store);

    const updateCartHandler = (item: CartItem, quantity: number) => {
        if (item.countInStock < quantity) {
            toast.warn('Producto fuera de stock');
            return
        };
        dispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        });
    };

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping')
    };

    const remouveItemHandler = (item: CartItem) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    }

    return (
        <div>
            <Helmet>
                <title>Carrito de la compra</title>
            </Helmet>
            <h1>Carrito de la compra</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            El carrito está vacío. <Link to='/'>Ver Productos</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item: CartItem) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-item-center">
                                        <Col md={4}>
                                            <img
                                                src={item.image}
                                                alt={item.image}
                                                className='img-fluid rounded thumbnail' />
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <Button onClick={() =>
                                                updateCartHandler(item, item.quantity - 1)
                                            }
                                                variant={mode}
                                                disabled={item.quantity === 1}
                                            >
                                                <i className="fas fa-minus-circle" />

                                            </Button>{' '}
                                            <span>{item.quantity}</span>
                                            <Button onClick={() =>
                                                updateCartHandler(item, item.quantity + 1)
                                            }
                                                variant={mode}
                                                disabled={item.quantity === item.countInStock}
                                            >
                                                <i className="fas fa-plus-circle" />

                                            </Button>{' '}
                                        </Col>
                                        <Col md={3}>{item.price}€</Col>
                                        <Col md={2}>
                                            <Button
                                                onClick={() => remouveItemHandler(item)}
                                                variant={mode}>
                                                <i className="fas fa-trash" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) :
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}€
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                            Realizar pago
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
        </div >
    )
}
