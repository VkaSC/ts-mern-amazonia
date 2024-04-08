import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox.js";
import { useSigninMutation } from "../hooks/userHooks.js";
import { Store } from "../Store.js";
import { ApiError } from "../types/ApiError.js";
import { getError } from "../utils.js";

export default function SigninPage() {
    const navigate = useNavigate();
    const { search } = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [email, setEmail] = useState('');
    const [password, setPasswoer] = useState('');

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    const { mutateAsync: signin, isPending } = useSigninMutation()

    //e: event
    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const data = await signin({
                email,
                password,
            })
            dispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
        } catch (err) {
            toast.error(getError(err as ApiError));

        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo]);

    return (
        <Container className="small-container">
            <Helmet>
                <title>Registrate</title>
            </Helmet>
            <h1 className="my-3">Registrate</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setPasswoer(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <div className="mb-3">
                        <Button disabled={isPending} type='submit'>
                            Registrate
                        </Button>
                        {isPending && <LoadingBox />}
                    </div>
                    <div className="mb-3">
                        Nuevo Usuario?{' '}
                        <Link to={`/signup?redirect=${redirect}`}>Crea una cuenta</Link>
                    </div>
                </Form.Group>
            </Form>
        </Container>
    )
}