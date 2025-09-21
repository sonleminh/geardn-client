'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Heading from '@/components/common/heading';
import ProductCard from '@/components/common/ProductCard';
import { IProduct } from '@/interfaces/IProduct';
import { Box, Button, Grid2 } from '@mui/material';
import { useState, useTransition } from 'react';
import { fetchProductsByCategory } from '@/data/product.server';

type Props = {
  slug: string;
  initialItems: IProduct[];
  initialCursor: string | null;
  initialHasMore: boolean;
  total: number;
};

export default function CategoryProductList({
  slug,
  initialItems,
  initialCursor,
  initialHasMore,
  total,
}: Props) {
  const [items, setItems] = useState<IProduct[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (!hasMore || !cursor) return;
    startTransition(async () => {
      try {
        const page = await fetchProductsByCategory({
          slug,
          cursor,
          limit: 2,
          revalidate: 0,
        });
        setItems((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]));
          console.log('map', map);
          for (const it of page?.data?.items) map.set(it.id, it);
          return Array.from(map.values());
        });
        setCursor(page.data.nextCursor);
        setHasMore(page.data.hasMore);
      } catch (e) {
        // optional: toast
        console.error(e);
      }
    });
  };
  return (
    <>
      <Heading total={total ?? 0} params={total ?? 0} />
      <Grid2 container spacing={2}>
        {items?.map((item) => (
          <Grid2 size={3} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={loadMore}
            disabled={isPending}
            variant='outlined'
            sx={{
              borderRadius: 100,
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}>
            {isPending
              ? 'Đang tải...'
              : `Xem thêm ${total - items.length} kết quả`}{' '}
            {!isPending && <ExpandMoreIcon sx={{ ml: 0.5 }} />}
          </Button>
        </Box>
      )}
    </>
  );
}
