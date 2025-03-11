import { axiosInstance } from "@/lib/utils/axiosInstance"
import { useMutation, useQuery } from "@tanstack/react-query"

interface getProductsPayload {
    sort?: string;
    page?: number;
  }
  

const getProducts = async (filter?: getProductsPayload) => {
   const res = await axiosInstance.get(`/products`, { params: filter})
   return res.data
}

export const useGetProducts = (filter?: getProductsPayload) => {
    return useQuery({
        queryKey: ["get-products", JSON.stringify(filter || {})],
    queryFn: () => getProducts(filter),
})
}