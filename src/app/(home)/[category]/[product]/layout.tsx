import React from 'react';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingCircle } from '@/components/common/LoadingCircle';
import LayoutContainer from '@/components/layout-container';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
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

export default async function ProductDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingCircle />}>
      <LayoutContainer>{children}</LayoutContainer>
    </Suspense>
  );
}
