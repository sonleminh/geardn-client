import { ICategory } from "@/interfaces/ICategory"
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { TPaginatedResponse } from "@/types/response.type"
import { useQuery } from "@tanstack/react-query"

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
    const res = await axiosInstance.get(`/categories`);
    return res.data as TPaginatedResponse<ICategory>;
  }
  
  export const categoriesQueryOptions = () => ({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    keepPreviousData: true,
  });