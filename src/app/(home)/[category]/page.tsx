// import { fetchProductsByCategory } from '@/data/product.server';
import { Box } from '@mui/material';
import ProductByCategoryClient from './ProductByCategoryClient';
import { getProductsByCategory } from '@/data/product.server';
import {
  buildProductListQuery,
  parseProductListParams,
} from '@/lib/search/productList.params';
// import { fetchProductsByCategory } from '@/data/product.server';

export default async function ProductByCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedParams = await searchParams;
  const parsed = parseProductListParams(resolvedParams);
  const paramsStr = buildProductListQuery(parsed);
  const initial = await getProductsByCategory(
    category,
    new URLSearchParams(paramsStr)
  );

  console.log('parsed', parsed);
  // console.log('qs', qs);

  return (
    <Box sx={{ py: 4, bgcolor: '#F3F4F6' }}>
      <ProductByCategoryClient
        slug={category}
        initial={initial}
        params={paramsStr}
      />
    </Box>
  );
}
