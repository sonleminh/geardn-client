import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { TPaginatedResponse } from "@/types/response.type"
import { ICategory } from "@/interfaces/ICategory"

const getCategories = async () => {
   const res = await axiosInstance.get(`/categories`,)
   return res.data
}

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
  })
}

  export async function fetchCategories() {
    const res = await fetch(`${process.env.BACKEND_API_URL}/categories`, {
      next: { revalidate: 60 } 
    });
    if (!res.ok) throw new Error('Failed to fetch products');

    return res.json() as Promise<TPaginatedResponse<ICategory>>;
  }
  
  export const categoriesQueryOptions = () => ({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    keepPreviousData: true,
  });