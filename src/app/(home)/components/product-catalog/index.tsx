// // src/app/(shop)/products/components/ProductListClient.tsx
// 'use client';

// import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import {
//   Box,
//   Pagination,
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Grid2,
// } from '@mui/material';
// import ProductCard from '@/components/common/ProductCard';

// type Props = {
//   products: Product[];
//   page: number;
//   totalPages: number;
//   q: string;
//   sort: string;
//   limit: number;
//   category: string;
// };

// function updateQuery(
//   params: URLSearchParams,
//   patch: Record<string, string | number | undefined>
// ) {
//   const next = new URLSearchParams(params);
//   for (const [k, v] of Object.entries(patch)) {
//     if (v === undefined || v === '' || v === 0) next.delete(k);
//     else next.set(k, String(v));
//   }
//   return next.toString();
// }

// export default function ProductListClient({
//   products,
//   page,
//   totalPages,
//   q,
//   sort,
//   limit,
//   category,
// }: Props) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const handlePageChange = (_: any, newPage: number) => {
//     const qs = updateQuery(searchParams, { page: newPage });
//     router.push(`${pathname}?${qs}`);
//   };

//   const handleSortChange = (value: string) => {
//     const qs = updateQuery(searchParams, { sort: value, page: 1 }); // reset về page 1 khi đổi sort
//     router.push(`${pathname}?${qs}`);
//   };

//   const handleSearch = (value: string) => {
//     const qs = updateQuery(searchParams, { q: value, page: 1 });
//     router.push(`${pathname}?${qs}`);
//   };

//   return (
//     <Box sx={{ display: 'grid', gap: 2 }}>
//       {/* Controls */}
//       <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//         <TextField
//           size='small'
//           placeholder='Tìm sản phẩm'
//           defaultValue={q}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter')
//               handleSearch((e.target as HTMLInputElement).value);
//           }}
//         />
//         <FormControl size='small' sx={{ minWidth: 180 }}>
//           <InputLabel>Sort</InputLabel>
//           <Select
//             label='Sort'
//             value={sort}
//             onChange={(e) => handleSortChange(e.target.value)}>
//             <MenuItem value=''>Mặc định</MenuItem>
//             <MenuItem value='price.asc'>Giá tăng dần</MenuItem>
//             <MenuItem value='price.desc'>Giá giảm dần</MenuItem>
//             <MenuItem value='newest'>Mới nhất</MenuItem>
//             <MenuItem value='popular'>Phổ biến</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Grid sản phẩm */}
//       <Grid2 container spacing={2}>
//         {products.map((p) => (
//           <Grid2 key={p.id} size={6}>
//             <ProductCard data={p} />
//           </Grid2>
//         ))}
//       </Grid2>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
//           <Pagination
//             page={page}
//             count={totalPages}
//             shape='rounded'
//             onChange={handlePageChange}
//           />
//         </Box>
//       )}
//     </Box>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { FullComponentLoader } from '@/components/common/FullComponentLoader';
import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/layout-container';
import ProductCard from '@/components/common/ProductCard';
import Heading from '@/components/common/heading';
import AppLink from '@/components/common/AppLink';

import { categoriesQueryOptions } from '@/apis/category';

import { ICategory } from '@/interfaces/ICategory';
import { ProductListStyle } from './style';
import { IProduct } from '@/interfaces/IProduct';
import { TPaginatedResponse } from '@/types/response.type';

const ProductCatalog = ({
  productsData,
  // categoriesData,
  params,
}: {
  productsData: TPaginatedResponse<IProduct>;
  // categoriesData: TPaginatedResponse<ICategory>;
  params: { q: string; page: string; sort: string };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || '';
  const total = productsData?.meta?.total ?? 0;

  console.log('total', total);

  const [currentPage, setCurrentPage] = useState<number>(page);
  const [currentSort, setCurrentSort] = useState<string>(sort);

  useEffect(() => {
    setCurrentPage(page);
    setCurrentSort(sort);
  }, [page, sort]);

  const handlePageChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    const params = new URLSearchParams(window.location.search);
    params.set('page', value.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };
  return (
    <Box>
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
                // bgcolor: '#fff',
              }}>
              <Box
                sx={{
                  pt: 2,
                  // minHeight: '400px',
                  // p: '12px 16px',
                  bgcolor: '#fff',
                  boxShadow:
                    '0 1px 2px 0 rgba(60, 64, 67, .1), 0 2px 6px 2px rgba(60, 64, 67, .15)',
                  borderRadius: 1,
                }}>
                <Typography className='category-heading' sx={{ mx: 2 }}>
                  Danh mục
                </Typography>
                {/* <List>
                  {categoriesData?.data?.map((item: ICategory) => (
                    <AppLink
                      href={item?.slug}
                      key={item?.id}
                      sx={{
                        color: '#000',
                      }}>
                      <ListItem
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          pl: 2,
                          pr: 1,
                          '&:hover': {
                            backgroundColor: '#eee',
                            transition: 'all 0.3s ease',
                            svg: {
                              display: 'block',
                            },
                          },
                        }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <Box
                            marginY={0.2}
                            sx={{
                              position: 'relative',
                              width: '28px',
                              height: { xs: '28px' },
                              mr: 2,
                              overflow: 'hidden',
                              '& img': {
                                objectFit: 'cover',
                              },
                            }}>
                            <SkeletonImage src={item?.icon} alt={'geardn'} />
                          </Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <ChevronRightIcon
                          sx={{ display: 'none', color: '#696969' }}
                        />
                      </ListItem>
                    </AppLink>
                  ))}
                </List> */}
              </Box>
            </Grid2>
            <Grid2 size={9}>
              <Box sx={{ position: 'relative' }}>
                <Heading total={total} />
                <Grid2 container spacing={2} sx={{ mb: 3 }}>
                  {productsData.data.length === 0
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
                              <Skeleton
                                variant='text'
                                width='100%'
                                height={21}
                              />
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
                  count={Math.ceil((total ?? 0) / 9)}
                  page={currentPage ?? 1}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductCatalog;
