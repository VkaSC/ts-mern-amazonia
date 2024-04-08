import { useContext, useEffect } from "react";
import { Button, Card, CardBody, CardText, CardTitle, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps.js";
import LoadingBox from "../components/LoadingBox.js";
import { useCreateOrderMutation } from "../hooks/orderHooks.js";
import { Store } from "../Store.js";
import { ApiError } from "../types/ApiError.js";
import { getError } from "../utils.js";

export default function PlaceOrderPage() {
    const navigate = useNavigate();

    const { state, dispatch } = useContext(Store);
    const { cart } = state;

    //redondeo de decimales
    const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.234 => 123.23

    //calcula el resultado de pultiplicar el precio de cada elemento por la cantidad de elementos
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    //Gastos de envío (precio > 100 redondea a la baja si < al alza)
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    //Impuestos (precio articulos x la tasa de impuestos)
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    //Precio final /Total compra) => suma de todos los resultados 
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const { mutateAsync: createOrder, isPending } = useCreateOrderMutation();

    const placeOrderHandler = async () => {
        try {
            const data = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            })
            dispatch({ type: 'CART_CLEAR' })
            localStorage.removeItem('cartItems')
            navigate(`/order/${data.order._id}`)
        } catch (err) {
            toast.error(getError(err as ApiError))
        }
    }
    useEffect(() => {
        if (!cart.paymentMethod
        ) {
            navigate('/payment')
        }
    }, [cart, navigate])

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>Previsualizar pedido</title>
            </Helmet>
            <h1 className="my-3">Previsualizar pedido</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle>Datos de Envío</CardTitle>
                            <CardText>
                                <strong>Nombre:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Dirección: </strong>{cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                                {cart.shippingAddress.country}
                            </CardText>
                            <Link to="/shipping">Editar</Link>
                        </CardBody>
                    </Card>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle>Método de Pago</CardTitle>
                            <CardText>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </CardText>
                            <Link to="/payment">Editar</Link>
                        </CardBody>
                    </Card>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle>Productos</CardTitle>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroupItem key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded thumbnail"
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                            <Link to="/cart">Editar</Link>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <CardBody>
                            <CardTitle>Resumen del pedido</CardTitle>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <Row>
                                        <Col>Productos</Col>
                                        <Col>{cart.itemsPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Envío</Col>
                                        <Col>{cart.shippingPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>IVA</Col>
                                        <Col>{cart.taxPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>{cart.totalPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroup>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0 || isPending}
                                        >
                                            Realizar Pedido
                                        </Button>
                                        {isPending && <LoadingBox></LoadingBox>}
                                    </div>
                                </ListGroup>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

