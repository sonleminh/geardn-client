import { IProduct } from "@/interfaces/IProduct";
import { IQuery } from "@/interfaces/IQuery";
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { TPaginatedResponse } from "@/types/response.type";
import { useMutation, useQuery } from "@tanstack/react-query"
import queryString from 'query-string';

const API = process.env.NEXT_PUBLIC_API_URL!;
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

  // export async function fetchProducts(page: number, sort?: string) {

  //   const params = new URLSearchParams({
  //     page: String(page ?? 1),
  //     limit: '9',
  //     ...(sort && sort !== '' ? { sort } : {})
  //   });

  //   const res = await fetch(`${process.env.BACKEND_API_URL}/products?${params.toString()}`, {
  //     next: { revalidate: 60 } 
  //   });
  //   if (!res.ok) throw new Error('Failed to fetch products');

  // return res.json() as Promise<TPaginatedResponse<IProduct>>;
  // }
  
  // export const productsQueryOptions = (page: number, sort?: string) => ({
  //   queryKey: ['products', page ?? 1, sort],
  //   queryFn: () => fetchProducts(page, sort),
  //   keepPreviousData: true,
  // });

  export async function listProducts(params: { q?: string; page?: number; sort?: string }) {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.page) sp.set('page', String(params.page));
    if (params.sort) sp.set('sort', params.sort);
  
    const res = await fetch(`${API}/products?${sp.toString()}`, {
      headers: { accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }