import { useQuery } from '@tanstack/react-query';
import { whoami } from '@/apis/session';

export function useSession() {
  return useQuery({ queryKey: ['whoami'], queryFn: whoami, retry: false });
}
