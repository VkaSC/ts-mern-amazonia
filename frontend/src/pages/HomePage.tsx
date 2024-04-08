import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox.js";
import MessageBox from "../components/MessageBox.js";
import ProductItem from "../components/ProductItem.js";
import { useGetProductQuery } from "../hooks/productHooks.js";
import { ApiError } from "../types/ApiError.js";
import { getError } from "../utils.js";


export default function HomePage() {
    const { data: products, isLoading, error } = useGetProductQuery()

    return (
        isLoading ? (
            <LoadingBox />
        ) : error ? (
            <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
        ) : (
            <Row>
                <Helmet>
                    <title>Artesanía Las Bonitas</title>
                </Helmet>
                {products!.map((product) => (
                    <Col key={product.slug} sm={6} md={4} lg={3}>
                        <ProductItem product={product} />
                    </Col>
                ))}
            </Row>
        )
    )
}