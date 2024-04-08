import { Form, useNavigate } from "react-router-dom";
import { Store } from "../Store.js";
import { useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps.js";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";

export default function ShippingAddress() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress },
    } = state;

    //Este codigo puede quitarse, la ruta esta protegida con el router (main.tsx)
    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping')
        }
    }, [userInfo, navigate]);

    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const submitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
            }
        })
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                address,
                city,
                postalCode,
                country,
            })
        );

        navigate('/payment');
    };


    return (
        <div>
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <div className="container small-container"></div>
            <h1 className="my-3">Shipping Address</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup className="mb-3" controlId="fullName">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="address">
                    <FormLabel>Dirección</FormLabel>
                    <FormControl
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="city">
                    <FormLabel>Localidad</FormLabel>
                    <FormControl
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="postalCode">
                    <FormLabel>Codigo postal</FormLabel>
                    <FormControl
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="country">
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </FormGroup>
                <div className="mb-3">
                    <Button variant="primary" type="submit">
                        Continuar
                    </Button>
                </div>
            </Form>
        </div>
    )
}