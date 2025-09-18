import Heading from '@/components/common/heading';
import ProductCard from '@/components/common/ProductCard';
import { IProduct } from '@/interfaces/IProduct';
import { Box, Grid2 } from '@mui/material';
import React from 'react';

type Props = {
  slug: string;
  initialItems: IProduct[];
  initialCursor: string | null;
  initialHasMore: boolean;
  total: number;
};

export default function CategoryProductList({
  slug,
  initialItems,
  initialCursor,
  initialHasMore,
  total,
}: Props) {
  return (
    <>
      <Heading total={total ?? 0} params={total ?? 0} />
      <Grid2 container spacing={2}>
        {initialItems?.map((item) => (
          <Grid2 size={3} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}
