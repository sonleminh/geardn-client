'use client';

import { Box, FormControl, NativeSelect, Typography } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const Heading = ({ total, params }: { total: number; params?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        mb: 2,
      }}>
      <Typography sx={{ fontSize: 15 }}>
        Tìm thấy <b>{total} </b>kết quả
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ mr: 1, fontSize: 14 }}>Sắp xếp theo:</Typography>
        <FormControl sx={{ width: '120px' }} size='small'>
          <NativeSelect
            defaultValue={''}
            disableUnderline
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('sort', e.target.value);
              console.log('e.target.value', e.target.value);
              console.log('params', params.toString());
              router.push(
                e.target.value?.length ? `?${params.toString()}` : pathname,
                { scroll: false }
              );
            }}
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
            <option value={''}>Mới nhất</option>
            <option value={'asc'}>Giá thấp đến cao</option>
            <option value={'desc'}>Giá cao đến thấp</option>
          </NativeSelect>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Heading;
