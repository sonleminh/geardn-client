import { IProduct } from "@/interfaces/IProduct";
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { TPaginatedResponse } from "@/types/response.type";
import { useMutation, useQuery } from "@tanstack/react-query"

interface getProductsPayload {
    sort?: string;
    page?: number;
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

const getProducts = async (filter?: getProductsPayload) => {
   const res = await axiosInstance.get(`/products`, { params: filter})
   return res.data  as TPaginatedResponse<IProduct>
}

export const useGetProducts = (filter?: getProductsPayload) => {
    return useQuery({
        queryKey: ["get-products", JSON.stringify(filter || {})],
    queryFn: () => getProducts(filter),
})
}

const getProductsByCategory = async (slug: string, filter?: getProductsPayload) => {
    const res = await axiosInstance.get(`/products/category/${slug}`, { params: filter})
    return res.data as IGetProductsResponse
 }
 
 export const useGetProductsByCategory = (slug:string, filter?: getProductsPayload) => {
     return useQuery({
        queryKey: ["get-products", JSON.stringify(filter || {})],
        queryFn: () => getProductsByCategory(slug,filter),
 })
 }

 const getProduct = async (slug: string) => {
    const res = await axiosInstance.get(`/products/slug/${slug}`)
    return res.data as IGetProductResponse
 }
 
 export const useGetProduct = (slug:string) => {
     return useQuery({
        queryKey: ["product", slug],
        queryFn: () => getProduct(slug),
 })
 }