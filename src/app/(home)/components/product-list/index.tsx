'use client';

import AppLink from '@/components/common/AppLink';
import ProductCard from '@/components/common/ProductCard';
import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/layout-container';

import { useGetCategories } from '@/apis/category';
import { fetchProducts, useGetProducts } from '@/apis/product';
import Heading from '@/components/common/heading';
import { IQuery } from '@/interfaces/IQuery';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ProductListStyle } from './style';
import { ICategory } from '@/interfaces/ICategory';
import { useQuery } from '@tanstack/react-query';

const ProductList = ({ page, limit }: { page: number; limit: number }) => {
  const [query, setQuery] = useState<IQuery>({
    limit: 2,
    page: 1,
  });

  // const { data: productsData, isPending: isProductsPending } = useQuery({
  //   queryKey: ['products', page, limit],
  //   queryFn: () => fetchProducts(page, limit),
  // });

  const { data: productsData, isPending: isProductsPending } =
    useGetProducts(query);
  const { data: categoriesData, isPending: isCategoriesPending } =
    useGetCategories();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };
  return (
    <LayoutContainer>
      <Box sx={ProductListStyle}>
        <Grid2 container spacing={3} sx={{}}>
          <Grid2
            size={3}
            className='category'
            sx={{
              position: 'sticky',
              top: 100,
              height: '100%',
              bgcolor: '#fff',
            }}>
            <Box
              sx={{
                minHeight: '400px',
                p: '12px 16px',
                boxShadow:
                  '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                borderRadius: 1,
              }}>
              <Typography className='category-heading'>Danh mục</Typography>
              <List>
                {isCategoriesPending
                  ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                      <Skeleton key={index} height={40} />
                    ))
                  : categoriesData?.data?.map((item: ICategory) => (
                      <AppLink
                        href={item?.slug}
                        key={item?.id}
                        sx={{
                          color: '#000',
                        }}>
                        <ListItem sx={{ display: 'flex', px: 0 }}>
                          <Box
                            sx={{
                              position: 'relative',
                              width: '24px',
                              height: { xs: '24px' },
                              mr: 1.5,
                              overflow: 'hidden',
                              '& img': {
                                objectFit: 'cover',
                              },
                            }}>
                            <SkeletonImage src={item?.icon} alt={'geardn'} />
                          </Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                        </ListItem>
                      </AppLink>
                    ))}
              </List>
            </Box>
          </Grid2>
          <Grid2 size={9}>
            <Box>
              <Heading total={productsData?.meta?.total ?? 0} />
              <Grid2 container spacing={2} sx={{ mb: 3 }}>
                {isProductsPending
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                      <Grid2 key={index} size={4}>
                        <Card>
                          <CardMedia>
                            <Skeleton
                              variant='rectangular'
                              width='100%'
                              height={250}
                            />
                          </CardMedia>
                          <CardContent
                            sx={{
                              p: '12px',
                              paddingBottom: '12px !important',
                            }}>
                            <Skeleton variant='text' width='100%' height={21} />
                            <Skeleton
                              variant='text'
                              width='100%'
                              height={21}
                              sx={{ mb: '8px' }}
                            />
                            <Box
                              sx={{
                                height: 24,
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}>
                              <Skeleton
                                variant='text'
                                height={24}
                                width={'40%'}
                              />
                              <Skeleton
                                variant='text'
                                height={24}
                                width={'40%'}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid2>
                    ))
                  : productsData?.data?.map((item, index) => (
                      <Grid2 key={index} size={4}>
                        <ProductCard data={item} />
                      </Grid2>
                    ))}
              </Grid2>
              <Pagination
                sx={{ display: 'flex', justifyContent: 'center' }}
                count={Math.ceil((productsData?.meta?.total ?? 0) / 2)}
                page={query?.page ?? 1}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </LayoutContainer>
  );
};

export default ProductList;
