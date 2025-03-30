import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosExtend, axiosInstance } from "@/lib/utils/axiosInstance";
import { ICartResponse, ISyncCartPayload } from "@/interfaces/ICart";
import { IUser } from "@/interfaces/IUser";

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
    short_codename: string;
  }

const getProvinces = async () => {
    const res = await axiosExtend.get(`https://provinces.open-api.vn/api`)
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
    const res = await axiosInstance.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
    return res.data
}
 
 export const useGetDistricts = (code: number) => {
    return useQuery({
        queryKey: ["province", code],
    queryFn: () => getDistricts(code),
    enabled: !!code
    })
 }

 const getPaymentMethods = async () => {
    const res = await axiosInstance.get(`payment-methods`)
    return res.data
}
 
 export const useGetPaymentMethods = () => {
    return useQuery({
        queryKey: ["payment-method"],
    queryFn: () => getPaymentMethods(),
    })
 }