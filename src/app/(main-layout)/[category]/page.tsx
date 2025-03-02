import ProductCard from '@/components/common/ProductCard';
import Heading from '@/components/common/sharing/heading';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { getPrdByCateSlug } from '@/services/product/api';
import {
  Box,
  FormControl,
  Grid2,
  NativeSelect,
  Typography,
} from '@mui/material';
import React from 'react';

const Category = async ({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { category } = await params;
  const paramsQuery = await searchParams;
  const page = paramsQuery?.page ?? '1';
  const sort = paramsQuery?.sort ?? '';
  console.log('category', category);
  console.log('paramsQuery', paramsQuery);
  const data = await getPrdByCateSlug(category, page, sort);
  return (
    <Box sx={{ py: 4, bgcolor: '#F3F4F6' }}>
      <LayoutContainer>
        <Heading total={data?.total ?? 0} params={category} />
        <Grid2 container spacing={2}>
          {data?.products?.map((item) => (
            <Grid2 size={3} key={item.id}>
              <ProductCard data={item} />
            </Grid2>
          ))}
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default Category;
