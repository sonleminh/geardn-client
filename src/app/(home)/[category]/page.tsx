// import { fetchProductsByCategory } from '@/data/product.server';
import { Box } from '@mui/material';
import ProductByCategoryClient from './ProductByCategoryClient';
import { getProductsByCategory } from '@/data/product.server';
import { parseProductListParams } from '@/lib/search/productList.params';
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
  const qs = new URLSearchParams({
    q: parsed.q,
    page: String(parsed.page),
    limit: '2',
    // limit: String(parsed.limit),
    sort: parsed.sort,
  });

  console.log('qs', qs);

  const initial = await getProductsByCategory(category, qs);
  return (
    <Box sx={{ py: 4, bgcolor: '#F3F4F6' }}>
      <ProductByCategoryClient
        slug={category}
        initial={initial}
        params={parsed}
      />
    </Box>
  );
}
