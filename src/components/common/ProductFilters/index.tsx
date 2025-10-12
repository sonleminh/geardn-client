// components/ProductFilters.tsx
'use client';
import { IQueryParams } from '@/interfaces/IQuery';
import { Box, NativeSelect, Typography } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export function ProductFilters({ initial }: { initial: IQueryParams }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [sort, setSort] = useState<string>(initial.sort);
  console.log('initial', initial);
  const mk = useMemo(() => {
    return (patch: Record<string, string>) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === '' || v == null) next.delete(k);
        else next.set(k, v);
      });
      // khi đổi q/sort nên reset page=1
      next.set('page', '1');
      router.replace(`/?${next.toString()}`, { scroll: false });
    };
  }, [sp, router]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ mr: 1, fontSize: 14 }}>Sắp xếp theo:</Typography>
      <NativeSelect
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          mk({ sort: e.target.value });
        }}
        disableUnderline
        sx={{
          p: 0,
          border: '1px solid #000',
          borderRadius: 1.5,
          fontSize: 14,
          '.MuiNativeSelect-select': {
            p: '4px 8px',
          },
          '& select': {
            backgroundColor: '#f5f5f5',
            color: '#000',
            borderRadius: '4px',
            padding: '8px',
          },
          '& option': {
            backgroundColor: '#fff',
            color: '#333',
            padding: '8px',
          },
        }}>
        <option value=''>Mới nhất</option>
        <option value='asc'>Giá thấp đến cao</option>
        <option value='desc'>Giá cao đến thấp</option>
      </NativeSelect>
    </Box>
  );
}
