import { axiosInstance } from "@/lib/utils/axiosInstance"
import { useMutation } from "@tanstack/react-query"

const loginWithEmailPwd = async (values: {email: string, password: string}) => {
   const res = await axiosInstance.post(`/auth/login`, values)
   return res.data
}

export const useLoginWithEmailPwd = () => {
    return useMutation({
        mutationFn: loginWithEmailPwd
    })
}