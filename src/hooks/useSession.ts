import { useQuery } from '@tanstack/react-query';
import { whoami } from '@/apis/session';
import { TBaseResponse } from '@/types/response.type';
import { IUser } from '@/interfaces/IUser';

export function useSession() {
  return useQuery<TBaseResponse<IUser>>({ queryKey: ['whoami'], queryFn: whoami, retry: false });
}
