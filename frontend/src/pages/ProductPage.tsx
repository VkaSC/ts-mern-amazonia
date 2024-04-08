import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox.js';
import MessageBox from '../components/MessageBox.js';
import Rating from '../components/Rating.js';
import { useGetProductDetailsByQuery } from '../hooks/productHooks.js';
import { Store } from '../Store.js';
import { ApiError } from '../types/ApiError.js';
import { convertProductToCartItem, getError } from '../utils.js';
import { useContext } from 'react'
import { toast } from 'react-toastify';

export default function ProductPage() {
  const params = useParams();
  const { slug } = params

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsByQuery(slug!);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const navigate = useNavigate();

  const addToCartHandle = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product!.countInStock < quantity) {
      toast.warn('Producto fuera de stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartItem(product!), quantity },
    });
    toast.success('El producto ha sido añadido al carrito');
    navigate('/cart')
  }

  return (
    isLoading ? (
      <LoadingBox />)
      :
      error ? (
        <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
      )
        : !product ? (
          <MessageBox variant="danger">Producto no encontrado</MessageBox>
        )
          : (
            <div>
              <Row>
                <Col md={6}>
                  <img className='large' src={product.image} alt={product.name} />
                </Col>
                <Col md={3}>
                  <ListGroup>
                    <ListGroup.Item>
                      <Helmet>
                        <title>{product.name}</title>
                      </Helmet>
                      <h1>{product.name}</h1>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        rating={product.rating}
                        numReviews={product.numReviews} />
                    </ListGroup.Item>
                    <ListGroup.Item>Precio: ${product.price}</ListGroup.Item>
                    <ListGroup.Item>
                      Descripción:
                      <p>{product.description}</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={3}>
                  <Card>
                    <Card.Body>
                      <ListGroup variant='flush'>
                        <ListGroup.Item>
                          <Row>
                            <Col>Precio:</Col>
                            <Col>{product.price}</Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>Estado:</Col>
                            <Col>{product.countInStock > 0 ? (
                              <Badge bg="success">En Stock</Badge>
                            ) : (
                              <Badge bg="info">Bajo pedido</Badge>
                            )}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        {product.countInStock > 0 ? (
                          <ListGroup.Item>
                            <div className='d-grid'>
                              <Button onClick={addToCartHandle} variant="primary">Añadir al carriro</Button>
                            </div>
                          </ListGroup.Item>
                        ) : (
                          <ListGroup.Item>
                            <div className='d-grid'>
                              <Button onClick={addToCartHandle} variant="primary">Hacer pedido</Button>
                            </div>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )
  )
}
