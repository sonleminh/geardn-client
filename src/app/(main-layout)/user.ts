import { getSession } from "@/authentication/cookie-session";
import { AgeRange, Gender } from "@/context/UserContext";
import { axiosInstance } from "@/lib/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface User {
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    providerUserId: any;
    email: string;
    username: any;
    name: string;
    gender: Gender;
    status: string;
    provider: string;
    balance: number;
    freeBalance: number;
    lastLoginAt: string;
    endedMemberAt: string | null | undefined;
    startMemberAt: string;
    role: string;
    isPartner: boolean;
    isPaid: boolean;
    ageRange: AgeRange;
    subscription?: Subscription;
  };
}

interface Subscription {
  id: string;
  createdAt: string;
  updatedAt: string;
  partnerSubscriptionId: string;
  partnerCustomerId: string;
  partnerCollectionMod: string;
  subscriptionId: any;
  startedAt: string;
  endedAt: string;
  frequency: number;
  interval: string;
  items: any;
  discount: any;
  userId: string;
  paymentPlatformCode: string;
  status: string;
  canceledAt: any;
  requestChange: any;
}

const getUser = async () => {
  const token = await getSession();

  if (!token) {
    return null;
  }

  const res = await axiosInstance.get<User>("/api/v1/user/users/me");

  return res.data?.data || null;
};

export const useUser = (enabled?: boolean) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled,
    placeholderData: null,
  });
};
