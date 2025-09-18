import { useGetProductsByCategory } from '@/apis/product';
import Heading from '@/components/common/heading';
import ProductCard from '@/components/common/ProductCard';
import { fetchProductsByCategory } from '@/data/product.server';
import { Box, Grid2 } from '@mui/material';
import CategoryProductList from './CategoryProductList';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  console.log('category:', category);

  const firstPage = await fetchProductsByCategory({
    slug: category,
    limit: 2,
    revalidate: 60,
  });

  return (
    <Box sx={{ py: 4, bgcolor: '#F3F4F6' }}>
      <CategoryProductList
        slug={category}
        initialItems={firstPage.data?.items ?? []}
        initialCursor={firstPage.data?.nextCursor ?? null}
        initialHasMore={firstPage.data?.hasMore ?? false}
        total={firstPage?.data?.total ?? 0}
      />
      {/* <Heading total={data?.total ?? 0} params={data?.total ?? 0} />
      <Grid2 container spacing={2}>
        {data?.data?.map((item) => (
          <Grid2 size={3} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2> */}
    </Box>
  );
}
