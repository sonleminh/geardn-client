import { IProduct } from "@/interfaces/IProduct";
import { IUser } from "@/interfaces/IUser";
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { useMutation, useQuery } from "@tanstack/react-query"

interface IAddToCartPayload {
    productId: number;
    skuId: number;
    quantity: number;
}

interface ICartStockResponse {
    success: boolean;
    message: string;
    data:  {id: number; quantity: number}[];
    total: number;
   
}

const addToCart = async (payload: IAddToCartPayload) => {
   const res = await axiosInstance.post(`/carts/add`, payload)
   return res.data
}

export const useAddToCart = () => {
    return useMutation({
        mutationFn: addToCart
    })
}

const getCart = async () => {
    const res = await axiosInstance.get(`/carts`)
    return res.data
}
 
 export const useGetCart = (user: IUser | null) => {
    return useQuery({
        queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: !!user
    })
}

const getCartStock = async (skuIds: number[]) => {
    const res = await axiosInstance.get(`/carts/stock?skuIds=${skuIds}`)
    return res.data as ICartStockResponse
}
 
 export const useGetCartStock = (skuIds: number[]) => {
    return useQuery({
        queryKey: ["cart-stock"],
    queryFn: () => getCartStock(skuIds),
    enabled: !!skuIds && skuIds?.length > 0
    })
}