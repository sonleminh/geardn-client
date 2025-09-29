import { fetchProduct } from '@/data/product.server';
import { Box } from '@mui/material';
import ProductDetailPage from './ProductDetailClient';

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;

  const productsData = await fetchProduct({ slug: product, revalidate: 0 });

  return (
    <Box>
      <ProductDetailPage data={productsData.data} />
    </Box>
  );
}
