'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import LayoutContainer from '@/components/common/sharing/layout-container';
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

const ProductList = ({
  productsData,
  categoriesData,
  currentPage,
}: {
  productsData: TProductsRes;
  categoriesData: TCategoriesRes;
  currentPage: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log('categories', categoriesData);

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
        <Grid2 container spacing={4} sx={{}}>
          <Grid2
            size={3}
            className='category'
            sx={{ position: 'sticky', top: 100, height: '100%' }}>
            <Box
              sx={{
                p: '12px 16px',
                boxShadow:
                  '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                borderRadius: 1,
              }}>
              <Typography className='category-heading'>Danh mục</Typography>
              <List>
                {categoriesData?.categories?.map((item) => (
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  mb: 2,
                }}>
                <Typography sx={{ fontSize: 15 }}>
                  Tìm thấy <b>{productsData?.total} </b>kết quả
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 1, fontSize: 14 }}>
                    Sắp xếp theo:
                  </Typography>
                  <FormControl sx={{ width: '120px' }} size='small'>
                    <NativeSelect
                      defaultValue={''}
                      // inputProps={{
                      //   name: 'age',
                      //   id: 'uncontrolled-native',
                      // }}
                      disableUnderline
                      onChange={(e) => {
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set('sort', e.target.value);
                        console.log('params', params.toString());
                        router.push(
                          e.target.value?.length
                            ? `?${params.toString()}`
                            : '/',
                          { scroll: false }
                        );
                      }}
                      // variant='filled'
                      sx={{
                        p: 0,
                        border: '1px solid #000',
                        borderRadius: 1.5,
                        fontSize: 14,
                        '.MuiNativeSelect-select': {
                          p: '4px 8px',
                        },
                        '& select': {
                          backgroundColor: '#f5f5f5',
                          color: '#000',
                          borderRadius: '4px',
                          padding: '8px',
                        },
                        '& option': {
                          backgroundColor: '#fff',
                          color: '#333',
                          padding: '8px',
                        },
                      }}>
                      <option value={''}>Mới nhất</option>
                      <option value={'asc'}>Giá thấp đến cao</option>
                      <option value={'desc'}>Giá cao đến thấp</option>
                    </NativeSelect>
                  </FormControl>
                </Box>
              </Box>
              <Grid2 container spacing={2} sx={{ mb: 3 }}>
                {productsData?.products?.map((item, index) => (
                  <Grid2 key={index} size={4}>
                    <ProductCard data={item} />
                  </Grid2>
                ))}
              </Grid2>
              <Pagination
                sx={{ display: 'flex', justifyContent: 'center' }}
                count={Math.ceil((productsData?.total ?? 0) / 9)}
                page={currentPage}
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
