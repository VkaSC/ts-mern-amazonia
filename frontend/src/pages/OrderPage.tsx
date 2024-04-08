import { PayPalButtons, PayPalButtonsComponentProps, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useEffect } from "react"
import { Button, Card, CardBody, CardText, CardTitle, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingBox from "../components/LoadingBox.js"
import MessageBox from "../components/MessageBox.js"
import { useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from "../hooks/orderHooks.js"
import { ApiError } from "../types/ApiError.js"
import { getError } from "../utils.js"

export default function OrderPage() {
    // const { state } = useContext(Store)
    // const { userInfo } = state

    const params = useParams()
    const { id: orderId } = params

    const {
        data: order,
        isLoading,
        error,
        refetch
    } = useGetOrderDetailsQuery(orderId!)

    const { mutateAsync: payOrder, isPending: loadingPay } = usePayOrderMutation()

    const testPayHandler = async () => {
        await payOrder({ orderId: orderId! })
        refetch()
        toast.success('Order is paid')
    }

    const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypalConfig } = useGetPaypalClientIdQuery()

    useEffect(() => {
        if (paypalConfig && paypalConfig.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'clientId': paypalConfig!.clientId,
                        currency: 'EUR' //Tipo de moneda
                    },
                })
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: SCRIPT_LOADING_STATE.PENDING
                })
            }
            loadPaypalScript()
        }
    }, [paypalConfig]);

    const paypalButtonTransactionProps: PayPalButtonsComponentProps = {
        style: { layout: 'vertical' },
        async createOrder(_data, actions) {
            const orderID = await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'EUR',
                            value: order!.totalPrice.toString(),
                        },
                    },
                ],
                intent: "CAPTURE" //SE HA AÑADIDO COMO PROPIADAD al corregir error
            })
            return orderID
        },
        //revisar con el video si error
        async onApprove(_data, actions) {
            const details = await actions.order!.capture()
            try {
                await payOrder({ orderId: orderId!, ...details })
                refetch()
                toast.success('Order is paid successfully')
            } catch (err) {
                toast.error(getError(err as ApiError))
            }
        },
        onError: (err) => {
            toast.error(getError(err as ApiError))
        },
    }

    return isLoading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
    ) : !order ? (
        <MessageBox variant="danger">Pedido no encontrado</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Pedido</title>
            </Helmet>
            <h1 className="my-3">Pedido {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <CardBody>
                            <CardTitle>Datos de Envío</CardTitle>
                            <CardText>
                                <strong>Nombre:</strong> {order.shippingAddress.fullName} <br />
                                <strong>Dirección: </strong>{order.shippingAddress.address},
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode},
                                {order.shippingAddress.country}
                            </CardText>
                            {order.isDelivered ? (
                                <MessageBox variant="success">
                                    Enviado a {order.deliveredAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="warning">
                                    No Enviado
                                </MessageBox>
                            )}
                        </CardBody>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Justificante de Pago</Card.Title>
                            <Card.Text>
                                <strong>Método de pago:</strong> {order.paymentMethod}
                            </Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant="success">
                                    Pago realizado el {order.paidAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="warning">Pendiente de pago</MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Productos</Card.Title>
                            <ListGroup variant="flush">
                                {order.orderItems.map((item) => (
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
                                            <Col md={3}>{item.price}€</Col>
                                        </Row>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </Card.Body>
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
                                        <Col>{order.itemsPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Envío</Col>
                                        <Col>{order.shippingPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>IVA</Col>
                                        <Col>{order.taxPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>{order.totalPrice.toFixed(2)}€</Col>
                                    </Row>
                                </ListGroupItem>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <LoadingBox />
                                        ) : isRejected ? (
                                            <MessageBox variant="danger">
                                                Error al conectar con PayPal
                                            </MessageBox>
                                        ) : (
                                            <div>
                                                <PayPalButtons
                                                    {...paypalButtonTransactionProps}
                                                ></PayPalButtons>
                                                <Button onClick={testPayHandler}>Test Pay</Button>
                                            </div>
                                        )}
                                        {loadingPay && <LoadingBox></LoadingBox>}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
