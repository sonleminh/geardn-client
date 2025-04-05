import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosExtend, axiosInstance } from "@/lib/utils/axiosInstance";
import { ICartResponse, ISyncCartPayload } from "@/interfaces/ICart";
import { IUser } from "@/interfaces/IUser";
import { IPaymentMethodListRespone } from "@/interfaces/IPayment";

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

 const createOrder = async (payload: ICreateOrderPayload) => {
    const res = await axiosInstance.post(`/orders`, payload)
    return res.data
 }
 
 export const useCreateOrder = () => {
     return useMutation({
         mutationFn: createOrder
     })
 }