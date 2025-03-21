'use client';

import { useUpdateQuantity } from '@/apis/cart';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { Box, Button, TextField, Typography } from '@mui/material';
import { startTransition, useCallback, useOptimistic } from 'react';

export default function Profile() {
  const { mutateAsync: onUpdateQuantity, isPending: isUpdateQuantityPending } =
    useUpdateQuantity();
  const { user } = useAuthStore((state) => state);
  const { cartItems, updateQuantity } = useCartStore();

  const [cartItemsOptimistic, updateCartItemsOptimistic] = useOptimistic(
    cartItems,
    (state, { skuId, newQuantity }) =>
      state.map((item) =>
        item?.skuId === skuId ? { ...item, newQuantity } : item
      )
  );
  console.log(
    'cartItems',
    cartItems?.map((item) => item?.quantity)
  );
  console.log(
    'cartItemsOptimistic',
    cartItemsOptimistic?.map((item) => item?.quantity)
  );

  const debouncedIncreaseQuantity = useCallback(
    debounce((payload: { skuId: number; quantity: number }) => {
      onUpdateQuantity(payload, {
        onError: () => {
          updateQuantity(payload.skuId, payload.quantity - 1); // !!
        },
        onSuccess: () => {
          updateQuantity(payload.skuId, payload.quantity); // !!
        },
      });
    }, 1000),
    []
  );

  const handleAddItem = async (skuId: number) => {
    const itemToUpdate = cartItems?.find((item) => item.skuId === skuId);

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + 1;

    startTransition(() => {
      updateCartItemsOptimistic({ skuId, newQuantity });
    });
    // updateCartItemsOptimistic({ skuId, newQuantity });
    // updateQuantity(skuId, newQuantity);
    if (user) {
      debouncedIncreaseQuantity({ skuId: skuId, quantity: newQuantity });
    }
  };

  function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  }
  return (
    <div>
      {cartItemsOptimistic?.map((row) => {
        return (
          <Box
            key={row.skuId}
            sx={{
              height: ' 96px',
              '&:last-child td, &:last-child th': { border: 0 },
            }}>
            <Typography>{row?.productName}</Typography>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 0.5,
                  '& .MuiButtonBase-root': {
                    minWidth: 28,
                    height: 28,
                    border: '1px solid #eee',
                  },
                }}>
                <Button
                  sx={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  // onClick={() =>
                  //   handleSubtractItem(row?.skuId, row?.productName)
                  // }
                >
                  -
                </Button>
                <TextField
                  sx={{
                    width: '36px',
                    height: 28,
                    borderTop: '1px solid rgba(0,0,0,.09)',
                    borderBottom: '1px solid rgba(0,0,0,.09)',
                    '& .MuiOutlinedInput-root': {
                      height: 28,
                      '& fieldset': {
                        display: 'none',
                      },
                    },
                    '.MuiInputBase-root': {
                      height: 28,
                      borderRadius: 0,
                      fontSize: 14,
                      '.MuiInputBase-input': {
                        height: 24,
                        p: 0,
                        textAlign: 'center',
                        ':focus': {
                          border: '1px solid #000',
                        },
                        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
                          {
                            display: 'none',
                          },
                      },
                      '& .Mui-disabled': {
                        color: '#000',
                        WebkitTextFillColor: 'inherit',
                      },
                    },
                  }}
                  variant='outlined'
                  type='number'
                  size='small'
                  value={row?.quantity}
                  disabled={true}
                />
                <Button
                  sx={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  onClick={() => handleAddItem(row?.skuId)}>
                  +
                </Button>
              </Box>
            </Box>
          </Box>
        );
      })}
    </div>
  );
}
