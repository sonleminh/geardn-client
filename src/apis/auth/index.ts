import { ILogInResponse } from "@/interfaces/IAuth"
import { axiosInstance } from "@/lib/utils/axiosInstance"
import { useMutation, useQuery } from "@tanstack/react-query"

const loginWithEmailPwd = async (values: {email: string, password: string}) => {
   const res = await axiosInstance.post(`/auth/login`, values)
   return res.data as ILogInResponse
}

export const useLoginWithEmailPwd = () => {
    return useMutation({
        mutationFn: loginWithEmailPwd
    })
}

const logout = async () => {
    const res = await axiosInstance.post(`/auth/logout`)
    return res.data
 }
 
 export const useLogout = () => {
     return useMutation({
        mutationFn: logout,
     })
 }