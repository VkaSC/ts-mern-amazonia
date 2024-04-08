import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignupMutation } from "../hooks/userHooks.js";
import { Store } from "../Store.js";
import { ApiError } from "../types/ApiError.js";
import { getError } from "../utils.js";

export default function SignupPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo]);

    const { mutateAsync: signup } = useSignupMutation();

    const submitHandler
        = async (e: React.SyntheticEvent) => {
            e.preventDefault();
            if (password !== confirmPassword) {
                toast.error('La contraseña no es correcta');
                return
            }
            try {
                const data = await signup({
                    name,
                    email,
                    password
                })
                dispatch({ type: 'USER_SIGNIN', payload: data })
                localStorage.setItem('userInfo', JSON.stringify(data))
                navigate(redirect)
            } catch (error) {
                toast.error(getError(error as ApiError))
            }
        }

    return (
        <Container className="small-container">
            <Helmet>
                <title>Registrar</title>
            </Helmet>
            <h1 className="my-3">Registar</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup className="mb-3" controlId="name" >
                    <FormLabel>Nombre</FormLabel>
                    <FormControl
                        type="name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="email" >
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="password" >
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
                <FormGroup className="mb-3" controlId="confirmPassword" >
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl
                        type="confirmPassword"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormGroup>

                <div className="mb-3">
                    <Button type="submit">Registrarse</Button>
                </div>

                <div className="mb-3">
                    Ya tengo cuenta{' '}
                    <Link to={`/singin?redirect=${redirect}`}>Sign In</Link>
                </div>
            </Form>
        </Container>
    )
}