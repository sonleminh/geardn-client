import React from 'react';
import { Suspense } from 'react';
import { LoadingCircle } from '@/components/common/LoadingCircle';
import Layout from '@/components/layout';
import AuthProvider from '@/providers/AuthProvider';

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingCircle />}>
      <Layout>{children}</Layout>
    </Suspense>
  );
}
