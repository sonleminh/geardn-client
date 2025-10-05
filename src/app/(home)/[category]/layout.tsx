import { LoadingCircle } from '@/components/common/LoadingCircle';
import LayoutContainer from '@/components/layout-container';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

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
  return (
    <Suspense fallback={<LoadingCircle />}>
      <LayoutContainer>{children}</LayoutContainer>
    </Suspense>
  );
}
