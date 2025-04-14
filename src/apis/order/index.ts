import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosExtend, axiosInstance } from "@/lib/utils/axiosInstance";
import { IPaymentMethodListRespone } from "@/interfaces/IPayment";
import { IOrder } from "@/interfaces/IOrder";
import { TBaseResponse } from "@/types/response.type";

export interface IProvince {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: IDistrict[];
  }
  
  export interface IDistrict {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards: IWard[];
  }
  
  export interface IWard {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
  }

  export interface IWard {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
  }

  interface ICreateOrderPayload {
        userId?: string | null;
        fullName: string;
        phoneNumber: string;
        email: string;
        totalPrice: number;
        note: string;
        shipment: {
            method: number;
            address: string;
            deliveryDate: Date
        },
        flag: {
            isOnlineOrder: boolean;
        },
        paymentMethodId: number;
        items:  {
            skuId: number;
            quantity: number
        }[]
}

const createOrder = async (payload: ICreateOrderPayload) => {
    const res = await axiosInstance.post(`/orders`, payload)
    return res.data as TBaseResponse<IOrder>
 }
 
 export const useCreateOrder = () => {
     return useMutation({
         mutationFn: createOrder
     })
 }

 const getOrder = async (orderCode: string) => {
    const res = await axiosInstance.get(`/orders/${orderCode}`)
    return res.data as TBaseResponse<IOrder>
 }
 
 export const useGetOrder = (orderCode: string) => {
     return useQuery({
        queryKey: ["orders", orderCode],
        queryFn: () => getOrder(orderCode),
    })
}

const getUserPurchases = async (type: number) => {
    const res = await axiosInstance.get(`/orders/user-purchases`, {params: { type }})
    return res.data as TBaseResponse<IOrder[]>
 }
 
 export const useGetUserPurchases = (type: number) => {
     return useQuery({
        queryKey: ["orders-user", type],
        queryFn: () => getUserPurchases(type),
    })
}

const getProvinces = async () => {
    const res = await axiosExtend.get(`https://provinces.open-api.vn/api/`)
    return res.data as IProvince[]
}
 
 export const useGetProvinces = () => {
    return useQuery({
        queryKey: ["provinces"],
    queryFn: () => getProvinces(),
    })
}

const getProvince = async (code: number) => {
    const res = await axiosExtend.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
    return res.data as IProvince
}
 
 export const useGetProvince = (code: number) => {
    return useQuery({
        queryKey: ["province", code],
    queryFn: () => getProvince(code),
    enabled: !!code
    })
}

const getDistricts = async (code: number) => {
    const res = await axiosExtend.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
    return res.data as IDistrict
}
 
 export const useGetDistricts = (code: number) => {
    return useQuery({
        queryKey: ["district", code],
    queryFn: () => getDistricts(code),
    enabled: !!code
    })
 }

 const getPaymentMethods = async () => {
    const res = await axiosInstance.get(`payment-methods`)
    return res.data as IPaymentMethodListRespone
}
 
 export const useGetPaymentMethods = () => {
    return useQuery({
        queryKey: ["payment-method"],
    queryFn: () => getPaymentMethods(),
    })
 }