// src/queries/location.ts
import { useQuery } from '@tanstack/react-query';
import { getProvinces, getDistricts, getWards } from '@/apis/location';
import { ILocationOption } from '@/interfaces/ILocation';

export const useProvinces = () =>
  useQuery<ILocationOption[]>({
    queryKey: ['prov'],
    queryFn: getProvinces,
    staleTime: 86_400_000, // 24h
  });

export const useDistricts = (provinceCode?: number) =>
  useQuery<ILocationOption[]>({
    queryKey: ['dist', provinceCode ?? null],
    queryFn: () => getDistricts(provinceCode!),
    enabled: !!provinceCode,
    staleTime: 86_400_000,
  });

export const useWards = (districtCode?: number) =>
  useQuery<ILocationOption[]>({
    queryKey: ['ward', districtCode ?? null],
    queryFn: () => getWards(districtCode!),
    enabled: !!districtCode,
    staleTime: 86_400_000,
  });
