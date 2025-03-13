import React from 'react';
import { Suspense } from 'react';
import { LoadingCircle } from '@/components/common/LoadingCircle';
import Layout from '@/components/layout';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  // const productData = await getProductBySlug(category);
  return {
    // title: productData?.data?.name,
    // description: productData?.data?.description,
    // openGraph: {
    //   title: product?.data,
    //   description: product?.data,
    //   images: [product?.data],
    // },
  };
}

export default async function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<LoadingCircle />}>{children}</Suspense>;
}
