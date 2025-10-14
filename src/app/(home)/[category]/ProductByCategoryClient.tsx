'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProductCard from '@/components/common/ProductCard';
import { IProduct } from '@/interfaces/IProduct';
import { Box, Button, Grid2, Typography } from '@mui/material';
import { useState, useTransition, useEffect, useMemo } from 'react';
import { getProductsByCategory } from '@/data/product.server';
import { TBaseResponse, TCursorPaginatedResponse } from '@/types/response.type';
import { ProductPage } from '@/apis/product';
import { IQueryParams } from '@/interfaces/IQuery';
import { useProductsByCategoryInfinite } from '@/queries/product';
import LayoutContainer from '@/components/layout-container';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  slug: string;
  initial: TCursorPaginatedResponse<IProduct> | null;
  params: string;
};

export default function ProductByCategoryClient({
  slug,
  initial,
  params,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  // console.log('sp', sp.toString());
  // console.log('params(client)', params);
  // console.log('initial(client)', initial);
  const q = useProductsByCategoryInfinite(slug, initial, params);
  const total = q?.data?.meta?.total ?? 0;
  const products = q?.data?.items ?? [];
  // console.log('initial', initial);
  // console.log('products', products);
  const mk = useMemo(() => {
    return (patch: Record<string, string>) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === '' || v == null) next.delete(k);
        else next.set(k, v);
      });
      // khi đổi q/sort nên reset page=1
      router.replace(`?${next.toString()}`);
    };
  }, [sp, router]);

  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: '', label: q?.data?.category?.name as string },
  ];

  const filterList = [
    { label: 'Mới nhất', value: '' },
    { label: 'Giá tăng dần', value: 'asc' },
    { label: 'Giá giảm dần', value: 'desc' },
  ];

  return (
    <LayoutContainer>
      <Box sx={{ mb: 1 }}>
        <Breadcrumbs options={breadcrumbsOptions} />
      </Box>
      <Box sx={{ display: ' flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography>Tìm thấy {total} sản phẩm</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {filterList?.map((filter, index) => (
            <Box key={filter?.value}>
              <Typography onClick={() => mk({ sort: filter.value })} sx={{}}>
                {filter.label}
              </Typography>
              {filterList.length - 1 !== index && (
                <Box
                  sx={{
                    width: '4px',
                    height: '4px',
                    mx: 2,
                    borderRadius: '50%',
                    backgroundColor: '#6b7280',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Grid2 container spacing={2}>
        {products?.map((item) => (
          <Grid2 size={3} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>
      {q.hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={() => q.fetchNextPage()}
            disabled={!q.hasNextPage || q.isFetchingNextPage}
            variant='outlined'
            sx={{
              borderRadius: 100,
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}>
            {q.isFetchingNextPage
              ? 'Đang tải...'
              : `Xem thêm ${total - products?.length} kết quả`}{' '}
            {!q.isFetchingNextPage && <ExpandMoreIcon sx={{ ml: 0.5 }} />}
          </Button>
        </Box>
      )}
    </LayoutContainer>
  );
}
