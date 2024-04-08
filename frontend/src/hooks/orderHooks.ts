import { useQuery } from '@tanstack/react-query';
import { ShippingAddress, CartItem } from './../types/Cart.js';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../apiClient.js';
import { Order } from '../types/Order.js';

//Recoge los datos de BE por eso ponemos 'Query al final'
export const useGetOrderDetailsQuery = (id: string) =>
    useQuery({
        queryKey: ['orders', id],
        queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
    })

//Recoger el id de paypal del cliente
export const useGetPaypalClientIdQuery = () =>
    useQuery({
        queryKey: ['paypal-clientId'],
        queryFn: async () =>
            (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
    })

export const usePayOrderMutation = () =>
    useMutation({
        mutationFn: async (details: { orderId: string }) => (
            await apiClient.put<{ message: string; order: Order }>(
                `api/orders/${details.orderId}/pay`,
                details
            )
        ).data,
    })

//modificar data in BE
export const useCreateOrderMutation = () =>
    useMutation({
        mutationFn: async (order: {
            orderItems: CartItem[]
            shippingAddress: ShippingAddress
            paymentMethod: string
            itemsPrice: number
            shippingPrice: number
            taxPrice: number
            totalPrice: number
        }) => (
            await apiClient.post<{ message: string; order: Order }>(
                `api/orders`,
                order
            )
        ).data,
    })

export const useGetOrderHistoryQuery = () =>
    useQuery({
        queryKey: ['order-history'],
        queryFn: async () =>
            (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
    })
