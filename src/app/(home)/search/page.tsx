// import { fetchProductsByCategory } from '@/data/product.server';
import { Box } from '@mui/material';
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@/data/product.server';
import {
  parseProductListParams,
  toURLSearchParams,
} from '@/lib/search/productList.params';
import SearchClient from './SeachClient';

export default async function ProductByCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const parsed = parseProductListParams(resolvedParams);
  const qs = toURLSearchParams(parsed);
  console.log('qs', qs);
  const initial = await searchProducts(qs);
  console.log('initial', initial);
  return (
    <Box sx={{ pt: 2, pb: 4, bgcolor: '#F3F4F6' }}>
      <SearchClient initial={initial} params={parsed} />
    </Box>
  );
}
