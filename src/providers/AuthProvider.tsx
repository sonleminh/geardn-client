'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  //   if (isLoading) return <p>Loading...</p>;

  return <>{children}</>;
}
