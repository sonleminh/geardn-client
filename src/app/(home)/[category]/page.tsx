// import { fetchProductsByCategory } from '@/data/product.server';
import { Box } from '@mui/material';
import CategoryProductClient from './CategoryProductClient';
import { fetchProductsByCategory } from '@/data/product.server';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedParams = await searchParams;
  const sortParam = resolvedParams.sort;

  const sort = Array.isArray(sortParam) ? sortParam[0] : sortParam ?? '';

  const firstPage = await fetchProductsByCategory({
    category: category,
    limit: 2,
    sort,
    revalidate: 0,
  });

  return (
    <Box sx={{ py: 4, bgcolor: '#F3F4F6' }}>
      <CategoryProductClient
        category={category}
        sort={sort}
        initialItems={firstPage.data?.items ?? []}
        initialCursor={firstPage.data?.nextCursor ?? null}
        initialHasMore={firstPage.data?.hasMore ?? false}
        total={firstPage?.data?.total ?? 0}
      />
    </Box>
  );
}
