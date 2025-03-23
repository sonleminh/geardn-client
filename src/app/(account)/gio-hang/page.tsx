'use client';

import React, {
  ChangeEvent,
  startTransition,
  useCallback,
  useOptimistic,
  useRef,
  useState,
} from 'react';

import SkeletonImage from '@/components/common/SkeletonImage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import {
  addCartAPI,
  deleteCartItem,
  subtractCartAPI,
  updateCartQuantityAPI,
} from '@/services/cart/api';
import { formatPrice } from '@/utils/format-price';

import {
  Box,
  Button,
  Checkbox,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EMPTY_CART from '@/assets/empty-cart.png';
import Link from 'next/link';
import { ICartItem, ICartStoreItem } from '@/interfaces/ICart';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/route';
import LayoutContainer from '@/components/layout-container';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useGetCartStock, useUpdateQuantity } from '@/apis/cart';
import CustomDialog from '@/components/common/CustomDialog';
import { truncateTextByLine } from '@/utils/css-helper.util';
import { LoadingCircle } from '@/components/common/LoadingCircle';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

const Cart = () => {
  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: ROUTES.CART, label: 'Giỏ hàng' },
  ];
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();

  const { user } = useAuthStore((state) => state);
  const { data: cartStock } = useGetCartStock(
    cartItems?.map((item) => item.skuId)
  );
  const { mutateAsync: onUpdateQuantity, isPending: isUpdateQuantityPending } =
    useUpdateQuantity();

  const { showNotification } = useNotificationStore();

  const [cartItemsOptimistic, updateCartItemsOptimistic] = useOptimistic(
    cartItems,
    (state, { skuId, newQuantity }) => {
      console.log('newQuantity', newQuantity);
      return state.map((item) =>
        item?.skuId === skuId ? { ...item, quantity: newQuantity } : item
      );
    }
  );

  const [openRemoveItemDialog, setOpenRemoveItemDialog] = useState(false);
  const [openOutOfStockDialog, setOpenOutOfStockDialog] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [subtractItem, setSubtractItem] = useState<{
    skuId: number;
    name: string;
  }>();

  console.log(
    'cartItems',
    cartItems?.map((item) => item.quantity)
  );
  console.log(
    'cartItemsOptimistic',
    cartItemsOptimistic?.map((item) => item.quantity)
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cartItems?.map((n) => n?.skuId);
      if (newSelected) {
        setSelected(newSelected);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const debouncedIncreaseQuantity = useCallback(
    debounce((payload: { skuId: number; quantity: number }) => {
      onUpdateQuantity(payload, {
        onError: () => {
          showNotification('Đã có lỗi xảy ra', 'error');
          updateQuantity(payload.skuId, payload.quantity - 1); // !!
        },
        onSuccess: () => {
          updateQuantity(payload.skuId, payload.quantity); // !!
        },
      });
    }, 1000),
    []
  );

  const debouncedReduceQuantity = useCallback(
    debounce((payload: { skuId: number; quantity: number }) => {
      onUpdateQuantity(payload, {
        onError: () => {
          showNotification('Đã có lỗi xảy ra', 'error');
          updateQuantity(payload.skuId, payload.quantity + 1); // !!
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
    console.log('newQuantity', newQuantity);

    startTransition(() => {
      console.log('opt');
      updateCartItemsOptimistic({ skuId, newQuantity });
      console.log('opt-end');
    });
    // updateQuantity(skuId, newQuantity);

    // if (user) {
    //   debouncedIncreaseQuantity({ skuId: skuId, quantity: newQuantity });
    // }
  };

  const handleSubtractItem = async (skuId: number, name: string) => {
    const itemToUpdate = cartItems?.find((item) => item.skuId === skuId);

    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity - 1;
    if (newQuantity === 0 && !user) {
      setOpenRemoveItemDialog(true);
      setSubtractItem({ skuId, name });
      return;
    }
    if (newQuantity === 0 && user) {
      setOpenRemoveItemDialog(true);
      setSubtractItem({ skuId, name });
      debouncedReduceQuantity({ skuId: skuId, quantity: newQuantity });
      return;
    }
    updateQuantity(skuId, newQuantity);
    debouncedReduceQuantity({ skuId: skuId, quantity: newQuantity });

    // try {
    //   const updatedCartData = await subtractCartAPI({
    //     userid: user?.id ? user?.id : null,
    //     model: skuId,
    //     quantity: 1,
    //   });

    //   mutateCart(updatedCartData, false);
    //   globalMutate('/api/cart');
    // } catch (error: any) {
    //   mutate(cart, false);
    //   showNotification(error?.message, 'error');
    // }
  };

  const handleDeleteItem = async (skuId: number) => {
    removeFromCart(skuId);
  };

  // const totalAmount = () => {
  //   const selectedItems = selected
  //     .map((skuId) => cart?.items?.find((item) => item.modelid === skuId))
  //     .filter((item) => item !== undefined);

  //   return selectedItems?.reduce(
  //     (acc, item) => acc + (item?.price ?? 0) * (item?.quantity ?? 0),
  //     0
  //   );
  // };

  // const handlePayBtn = () => {
  //   if (selected.length === 0) {
  //     return showNotification('Vui lòng chọn sản phẩm', 'warning');
  //   }
  //   const selectedItems = selected
  //     .map((skuId) => cart?.items?.find((item) => item.modelid === skuId))
  //     .filter((item): item is ICartItem => item !== undefined);
  //   addProducts(selectedItems);
  //   router.push(ROUTES.CHECKOUT);
  // };

  const handleOkRemoveItemDialog = () => {
    if (subtractItem) {
      removeFromCart(subtractItem.skuId);
    }
    handleCloseRemoveItemDialog();
  };

  const handleCloseRemoveItemDialog = () => {
    setOpenRemoveItemDialog(false);
  };

  const handleOkOutOfStockDialog = () => {
    setOpenOutOfStockDialog(false);
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
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box>
          {cartItems?.length > 0 ? (
            <Grid2 container spacing={2}>
              <Grid2 size={8.5}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell width={'5%'}>
                          <Checkbox
                            color='primary'
                            checked={
                              cartItems?.length > 0 &&
                              selected?.length === cartItems?.length
                            }
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all desserts',
                            }}
                          />
                        </TableCell>
                        <TableCell width={'45%'}>Sản phẩm</TableCell>
                        <TableCell align='center'>Giá</TableCell>
                        <TableCell align='center'>Số lượng</TableCell>
                        <TableCell align='center' width={'13%'}>
                          Tuỳ chọn
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItemsOptimistic?.map((row) => {
                        const isItemSelected = selected.includes(row.skuId);
                        return (
                          <TableRow
                            key={row.skuId}
                            sx={{
                              height: ' 96px',
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}>
                            <TableCell component='th' scope='row'>
                              <Checkbox
                                color='primary'
                                checked={isItemSelected}
                                onClick={(e) => handleClick(e, row.skuId)}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '20%',
                              }}
                              component='th'
                              scope='row'>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    width: 60,
                                    height: 60,
                                    mr: 2,
                                    flexShrink: 0,
                                    '.product-image': {
                                      objectFit: 'cover',
                                    },
                                  }}>
                                  <SkeletonImage
                                    src={row?.imageUrl}
                                    alt={row?.productName}
                                    fill
                                    className='product-image'
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    sx={{
                                      maxHeight: '32px',
                                      mb: 0.5,
                                      fontSize: 14,
                                      lineHeight: '16px',

                                      ...truncateTextByLine(2),
                                    }}>
                                    {row?.productName}
                                  </Typography>
                                  {row?.attributes?.length ? (
                                    <Typography
                                      sx={{
                                        display: 'inline-block',
                                        px: '5px',
                                        py: '1.5px',
                                        bgcolor: '#f3f4f6',
                                        fontSize: 11,
                                        borderRadius: 0.5,
                                      }}>
                                      {row?.attributes
                                        ?.map((item) => item?.value)
                                        .join(', ')}
                                    </Typography>
                                  ) : (
                                    ''
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: 14 }}
                              component='th'
                              scope='row'
                              align='center'>
                              {formatPrice(row?.price)}
                            </TableCell>
                            <TableCell
                              component='th'
                              scope='row'
                              align='center'>
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
                                  onClick={() =>
                                    handleSubtractItem(
                                      row?.skuId,
                                      row?.productName
                                    )
                                  }>
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
                                  onClick={() => handleAddItem(row?.skuId)}
                                  disabled={
                                    (cartStock?.data?.find(
                                      (item) => item.id === row?.skuId
                                    )?.quantity ?? 0) <= (row?.quantity ?? 0)
                                  }>
                                  +
                                </Button>
                              </Box>
                              {cartStock?.data &&
                                (cartStock?.data?.find(
                                  (item) => item.id === row?.skuId
                                )?.quantity ?? 0) < 10 && (
                                  <Typography
                                    sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                                    Còn{' '}
                                    {
                                      cartStock?.data?.find(
                                        (item) => item.id === row?.skuId
                                      )?.quantity
                                    }{' '}
                                    sản phẩm
                                  </Typography>
                                )}
                            </TableCell>
                            <TableCell
                              component='th'
                              scope='row'
                              align='center'>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  ':hover': {
                                    color: 'red',
                                    cursor: 'pointer',
                                  },
                                }}
                                onClick={() => handleDeleteItem(row?.skuId)}>
                                Xóa
                              </Typography>
                            </TableCell>
                            <CustomDialog
                              content={`Rất tiếc, bạn chỉ có thể mua tối đa ${
                                cartStock?.data?.find(
                                  (item) => item.id === row?.skuId
                                )?.quantity ?? 0
                              } sản phẩm của chương trình giảm giá này`}
                              showCancelButton={false}
                              open={openOutOfStockDialog}
                              handleOk={handleOkOutOfStockDialog}
                            />
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid2>
              <Grid2 sx={{ bgcolor: '#fff', borderRadius: 1 }} size={3.5} p={3}>
                <Grid2 className='total'>
                  <Grid2 size={6} mb={2} className='total-price-label'>
                    Tổng thanh toán ({selected?.length} sản phẩm):
                  </Grid2>
                  <Grid2
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                    size={6}
                    className='total-price-cost'>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                      Thành tiền:
                    </Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                      {/* {formatPrice(totalAmount())} */}
                    </Typography>
                  </Grid2>
                  <Button
                    sx={{ mb: 1.5, fontWeight: 600 }}
                    variant='contained'
                    size='large'
                    fullWidth
                    // onClick={handlePayBtn}
                  >
                    Thanh toán
                  </Button>
                  <Button
                    sx={{ fontWeight: 600 }}
                    variant='outlined'
                    size='large'
                    fullWidth>
                    Tiếp tục mua hàng
                  </Button>
                </Grid2>
              </Grid2>
            </Grid2>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pb: 5,
              }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '300px',
                  height: { xs: '180px' },
                  overflow: 'hidden',
                  '& img': {
                    objectFit: 'contain',
                  },
                }}>
                <SkeletonImage
                  src={EMPTY_CART}
                  alt='geardn'
                  fill
                  quality={90}
                  priority
                />
              </Box>
              <Typography sx={{ mb: 2, fontSize: 20 }}>
                Giỏ hàng trống
              </Typography>
              <Button
                sx={{ width: 220, fontWeight: 600 }}
                component={Link}
                href='/'
                variant='contained'
                size='large'
                fullWidth>
                Tiếp tục mua hàng
              </Button>
            </Box>
          )}
        </Box>
      </LayoutContainer>
      <CustomDialog
        title='Bạn chắc chắn muốn bỏ sản phẩm này?'
        okContent='Có'
        cancelContent='Không'
        open={openRemoveItemDialog}
        handleOk={handleOkRemoveItemDialog}
        handleClose={handleCloseRemoveItemDialog}
      />
      {isUpdateQuantityPending && <FullScreenLoader />}
    </Box>
  );
};

export default Cart;
