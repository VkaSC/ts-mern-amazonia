import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox.js";
import MessageBox from "../components/MessageBox.js";
import { useGetOrderHistoryQuery } from "../hooks/orderHooks.js";
import { ApiError } from "../types/ApiError.js";
import { getError } from "../utils.js";

export default function OrderHistoryPage() {
    const navigate = useNavigate();
    const { data: order, isLoading, error } = useGetOrderHistoryQuery();

    return (
        <div>
            <Helmet>
                <title>Historial de Pedidos</title>
            </Helmet>
            <h1>Historial de Pedidos</h1>
            {isLoading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>ACTIONS</th>
                    </thead>
                    <tbody>
                        {/*la '!' la ponemos para asegurarnos de que en este punto existen pedidos que mapear*/}
                        {order!.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => {
                                            navigate(`/order/${order._id}`)
                                        }}>
                                        Detalles
                                    </Button></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}