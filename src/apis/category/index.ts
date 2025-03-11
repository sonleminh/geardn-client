import { axiosInstance } from "@/lib/utils/axiosInstance"
import { useQuery } from "@tanstack/react-query"

const getCategories = async () => {
   const res = await axiosInstance.get(`/categories`,)
   return res.data
}

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["get-categories"],
        queryFn: () => getCategories(),
})
}