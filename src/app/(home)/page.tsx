import { productsQueryOptions } from '@/apis/product';
import BANNER_BG from '@/assets/geardn.jpg';
import SkeletonImage from '@/components/common/SkeletonImage';
import LayoutContainer from '@/components/layout-container';
import { Box } from '@mui/material';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import ProductList from './components/product-list';
import { categoriesQueryOptions } from '@/apis/category';

export async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams.page;
  const sortParam = resolvedParams.sort;
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? 1);
  const sort = Array.isArray(sortParam) ? sortParam[0] : sortParam ?? '';
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(productsQueryOptions(page, sort));
  await queryClient.prefetchQuery(categoriesQueryOptions());
  const dehydratedState = dehydrate(queryClient);

  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '800px' },
          overflow: 'hidden',
          '& img': {
            objectFit: 'cover',
          },
          ':before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(8px)',
            zIndex: 1,
          },
        }}>
        <SkeletonImage
          src={BANNER_BG}
          alt='geardn'
          fill
          quality={90}
          priority
        />
      </Box>
      <section id='shop'>
        <HydrationBoundary state={dehydratedState}>
          <ProductList />
        </HydrationBoundary>
      </section>
      {/* <Explore productsData={productsData} /> */}
      <LayoutContainer>
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 5,
            backgroundImage: 'linear-gradient(#363636, #1E1E1E)',
            color: '#fff',
            borderRadius: 3,
          }}>
          <Box sx={{ width: '35%' }}>
            <Typography
              sx={{ mb: 4, fontSize: 30, fontWeight: 600, lineHeight: '38px' }}>
              Sẵn sàng khám phá những sản phẩm mới?
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '260px',
                p: '4px 4px 4px 16px',
                bgcolor: '#fff',
                borderRadius: 10,
              }}>
              <InputBase placeholder='Email ..' />
              <Button
                variant='contained'
                sx={{ width: '88px', borderRadius: 10 }}>
                Gửi
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
            }}>
            <Typography>asf asfas fasf as</Typography>
            <Typography>asf asfas fasf as</Typography>
          </Box>
        </Box> */}
      </LayoutContainer>
    </Box>
  );
}

export default Homepage;
