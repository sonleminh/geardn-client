import { IProduct } from "@/interfaces/IProduct";
import { IQuery } from "@/interfaces/IQuery";
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { TPaginatedResponse } from "@/types/response.type";
import { useMutation, useQuery } from "@tanstack/react-query"
import queryString from 'query-string';

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

//  export async function fetchProducts(page: number, limit: number) {
//     const res = await axiosInstance.get(`/products?page=${page}&limit=${limit}`)
//     // if (!res?.ok) throw new Error('Failed to fetch')
//     return res.data  as TPaginatedResponse<IProduct>
//   }

  export async function fetchProducts(page: number, sort?: string) {
    const params: Record<string, any> = {
      page: page ?? 1,
      limit: 2,
    };
  
    if (sort && sort !== '') {
      params.sort = sort;
    }
    const res = await axiosInstance.get(`/products`, {
      params
    });
    return res.data as TPaginatedResponse<IProduct>;
  }
  
  export const productsQueryOptions = (page: number, sort?: string) => ({
    queryKey: ['products', page ?? 1, sort],
    queryFn: () => fetchProducts(page, sort),
    keepPreviousData: true,
  });