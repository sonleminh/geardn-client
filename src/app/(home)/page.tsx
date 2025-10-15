import { Box, Button, InputBase, Typography } from '@mui/material';
import SkeletonImage from '@/components/common/SkeletonImage';
import ProductCatalog from './components/product-catalog';

import BANNER_BG from '@/assets/geardn.jpg';
import Explore from './components/explore';
import LayoutContainer from '@/components/layout-container';
// import { fetchProducts } from '@/data/product.server';
import { fetchCategories, getCategories } from '@/data/category.server';
import {
  parseProductListParams,
  toURLSearchParams,
} from '@/lib/search/productList.params';
import { getProducts } from '@/data/product.server';

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const parsed = parseProductListParams(resolvedParams);
  const qs = toURLSearchParams(parsed);
  console.log('parsed', parsed.sort);
  const productPage = await getProducts(qs);
  const categoryPage = await getCategories();

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
        <ProductCatalog
          products={productPage?.data}
          categories={categoryPage?.data}
          pagination={productPage?.meta}
          params={parsed}
        />
      </section>

      {/* <Explore exploreData={productsData.data} /> */}

      <LayoutContainer>
        <Box
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
              justifyContent: 'end',
              flexDirection: 'column',
              width: 400,
            }}>
            <Typography sx={{ mb: 2 }}>
              GearDN cung cấp các sản phẩm chất lượng tốt.
            </Typography>
            <Typography sx={{ color: '#bdbdbd' }}>
              Chúng tôi cung cấp nhiều sản phẩm với nhiều thương hiệu khác nhau
              để bạn có thể lựa chọn.
            </Typography>
          </Box>
        </Box>
      </LayoutContainer>
    </Box>
  );
}
