import { IProduct } from "@/interfaces/IProduct";
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { useMutation, useQuery } from "@tanstack/react-query"

interface IAddToCartPayload {
    productId: number;
    skuId: number;
    quantity: number;
  }
  
interface IGetProductsResponse {
    success: boolean;
    message: string;
    data: IProduct[];
    total: number;
}

interface IGetProductResponse {
    success: boolean;
    message: string;
    data: IProduct;
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
 
 export const useGetCart = () => {
    return useQuery({
        queryKey: ["cart"],
    queryFn: () => getCart(),
})
 }