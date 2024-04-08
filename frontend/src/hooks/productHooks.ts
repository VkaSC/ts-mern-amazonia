import { useQuery } from "@tanstack/react-query"
import apiClient from "../apiClient.js"
import { Product } from "../types/Product.js"

export const useGetProductQuery = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: async () => (
            await apiClient.get<Product[]>(`api/products`)
        ).data
    });

export const useGetProductDetailsByQuery = (slug: string) =>
    useQuery({
        queryKey: ['products', slug],
        queryFn: async () =>
            (await apiClient.get<Product>(`api/products/slug/${slug}`)).data
    })