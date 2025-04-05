'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import LayoutContainer from '@/components/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import ProductCard from '@/components/common/ProductCard';
import AppLink from '@/components/common/AppLink';

import { TCategoriesRes } from '@/services/category/api';
import { TProductsRes } from '@/services/product/api';
import {
  Box,
  FormControl,
  Grid2,
  List,
  ListItem,
  NativeSelect,
  Pagination,
  Typography,
} from '@mui/material';
import { ProductListStyle } from './style';
import Heading from '@/components/common/heading';
import { TPaginatedResponse } from '@/types/response.type';
import { IProduct } from '@/interfaces/IProduct';

const ProductList = ({
  productsData,
  categoriesData,
}: // currentPage,
{
  productsData: TPaginatedResponse<IProduct>;
  categoriesData: TCategoriesRes;
  // currentPage: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
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
                p: '12px 16px',
                boxShadow:
                  '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                borderRadius: 1,
              }}>
              <Typography className='category-heading'>Danh mục</Typography>
              <List>
                {categoriesData?.data?.map((item) => (
                  <AppLink
                    href={item?.slug}
                    key={item.id}
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
                        <SkeletonImage src={item.icon} alt={'geardn'} />
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
                {productsData?.data?.map((item, index) => (
                  <Grid2 key={index} size={4}>
                    <ProductCard data={item} />
                  </Grid2>
                ))}
              </Grid2>
              {/* <Pagination
                sx={{ display: 'flex', justifyContent: 'center' }}
                count={Math.ceil((productsData?.total ?? 0) / 9)}
                page={currentPage}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              /> */}
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </LayoutContainer>
  );
};

export default ProductList;
