'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StarRateIcon from '@mui/icons-material/StarRate';
import { SwiperClass } from 'swiper/react';

import { useGetProduct } from '@/apis/product';
import { useAddToCart } from '@/apis/cart';

import LayoutContainer from '@/components/layout-container';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import AppLink from '@/components/common/AppLink';
import HtmlRenderBox from '@/components/common/HtmlRenderBox';

import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';

import { ISku } from '@/interfaces/ISku';
import { formatPrice } from '@/utils/format-price';
import { attributeLabels } from '@/constants/attributeLabels';

import { useNotificationStore } from '@/stores/notification-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { ATTRIBUTE_ORDER } from '@/constants/attributeOrder';

const ProductDetailPage = () => {
  const params = useParams();
  const product = params.product as string;
  const { user } = useAuthStore();
  const { cartItems, addToCart, removeItem, updateQuantity } = useCartStore();
  const { data } = useGetProduct(product);
  const { mutateAsync: onAddToCart } = useAddToCart();
  const { showNotification } = useNotificationStore();
  console.log('cartItems', cartItems);

  const [count, setCount] = useState<number | null>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  console.log('count', count);

  const productImageList = useMemo(() => {
    return [
      ...(data?.data?.images || []),
      ...(data && data?.data?.skus?.length > 1
        ? data?.data?.skus.map((sku) => sku.imageUrl)
        : []),
    ];
  }, [data?.data?.images, data?.data?.skus]);

  const attributeOptions = useMemo(() => {
    if (!data?.data) return {};

    const options: Record<string, string[]> = {};
    data?.data?.skus?.forEach((sku) => {
      sku?.productSkuAttributes?.forEach(({ attributeValue }) => {
        if (!options[attributeValue.attributeId]) {
          options[attributeValue.attributeId] = [];
        }
        if (
          !options[attributeValue.attributeId].includes(attributeValue.value)
        ) {
          options[attributeValue.attributeId].push(attributeValue.value);
        }
      });
    });

    const order =
      ATTRIBUTE_ORDER[data?.data?.category?.name] ?? Object.keys(options);

    const sortedOptions: Record<string, string[]> = {};
    order.forEach((key) => {
      if (options[key]) {
        sortedOptions[key] = options[key];
      }
    });

    return sortedOptions;
  }, [data?.data]);

  const selectedSku = useMemo<ISku | null>(() => {
    const hasNullValue = Object.values(selectedAttributes).some(
      (value) => value === null
    );

    if (
      hasNullValue ||
      Object.keys(selectedAttributes).length !==
        Object.keys(attributeOptions).length
    )
      return null;

    return (
      data?.data?.skus?.find((sku) =>
        Object.entries(selectedAttributes).every(([key, value]) =>
          sku.productSkuAttributes.some(
            (attr) =>
              attr.attributeValue.attributeId === Number(key) &&
              attr.attributeValue.value === value
          )
        )
      ) ?? null
    );
  }, [selectedAttributes, data?.data?.skus]);

  const availableCombinations = data?.data?.skus?.map((sku) =>
    sku.productSkuAttributes.reduce((acc, attr) => {
      acc[attr.attributeValue.attributeId] = attr.attributeValue.value;
      return acc;
    }, {} as Record<string, string>)
  );

  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };

      if (newAttributes[type] === value) {
        delete newAttributes[type]; // Nếu đã chọn, thì bỏ chọn
      } else {
        newAttributes[type] = value; // Nếu chưa chọn, thì chọn
      }

      return newAttributes;
    });
  };

  const handleDisableAttribute = useMemo(() => {
    return (type: string, value: string) => {
      if (Object.keys(selectedAttributes).length === 0) return false;
      // Tạo bản sao tránh mutate state gốc
      const simulatedSelection = { ...selectedAttributes };

      // Nếu đã chọn, loại bỏ thuộc tính khỏi danh sách chọn
      if (simulatedSelection[type] === value) {
        delete simulatedSelection[type]; // Xóa hẳn key
      } else {
        simulatedSelection[type] = value; // Chọn mới
      }

      const filteredSelection = Object.fromEntries(
        Object.entries(simulatedSelection).filter(([_, val]) => val)
      );

      // Nếu không còn gì trong selectedAttributes, không disable gì cả
      if (Object.keys(filteredSelection).length === 0) return false;

      // Kiểm tra nếu tổ hợp mới này có hợp lệ
      const isValid = availableCombinations?.some((combo) =>
        Object.entries(filteredSelection).every(
          ([key, val]) => combo[key] === val
        )
      );

      return !isValid;
    };
  }, [selectedAttributes]);
  const handleAddCartItem = async () => {
    if (selectedSku === null) {
      return showNotification('Vui lòng chọn phân loại hàng', 'error');
    }

    if (!user && data) {
      const itemAdded = cartItems?.find(
        (item) => item.skuId === selectedSku?.id
      );
      if (
        itemAdded &&
        itemAdded?.quantity + (count ?? 1) > selectedSku?.quantity
      ) {
        return showNotification(
          `Bạn đã có ${itemAdded?.quantity} trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá số lượng trong kho.`,
          'error'
        );
      }

      return addToCart({
        productId: selectedSku?.productId,
        skuId: selectedSku?.id,
        productName: data?.data?.name,
        imageUrl:
          selectedSku?.imageUrl !== ''
            ? selectedSku?.imageUrl
            : data?.data?.images?.[0],
        price: selectedSku?.price,
        quantity: count ?? 1,
        attributes: selectedSku?.productSkuAttributes.map((attr) => ({
          attributeId: attr.attributeValue.attributeId,
          value: attr.attributeValue.value,
        })),
      });
    }

    if (user && data) {
      const newItem = {
        productId: selectedSku?.productId,
        skuId: selectedSku?.id,
        productName: data?.data?.name,
        imageUrl:
          selectedSku?.imageUrl !== ''
            ? selectedSku?.imageUrl
            : data?.data?.images?.[0],
        price: selectedSku?.price,
        quantity: count ?? 1,
        attributes: selectedSku?.productSkuAttributes.map((attr) => ({
          attributeId: attr.attributeValue.attributeId,
          value: attr.attributeValue.value,
        })),
      };

      addToCart(newItem);

      try {
        await onAddToCart(
          {
            productId: selectedSku?.productId,
            skuId: selectedSku?.id,
            quantity: count ?? 1,
          },
          {
            onError: () => {
              const cartItem = cartItems?.find(
                (item) => item.skuId === selectedSku?.id
              );
              if (cartItem && cartItem?.quantity - (count ?? 0) <= 0) {
                removeItem(selectedSku?.id);
              } else {
                updateQuantity(
                  selectedSku?.id,
                  selectedSku?.quantity - (count ?? 0)
                );
              }
              showNotification('Đã có lỗi xảy ra', 'error');
            },
          }
        );
      } catch (error) {
        console.log('error', error);
        removeItem(newItem.skuId);
        showNotification('Lỗi kết nối tới máy chủ', 'error');
      }
    }
  };

  const handleCountChange = (value: number | null) => {
    if (value && value >= 0) {
      setCount(value);
    }
  };

  const breadcrumbsOptions = [
    { href: '/', label: 'Home' },
    { href: `/product/${product}`, label: data?.data?.name as string },
  ];

  const getLowestPrice = () => {
    if (!data?.data?.skus || data?.data?.skus.length === 0) return null;

    return Math.min(...data?.data?.skus.map((sku) => Number(sku.price)));
  };

  const totalStock = data?.data?.skus?.reduce(
    (acc, sku) => acc + (sku.quantity || 0),
    0
  );

  return (
    <Box pt={2} pb={4}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ px: 3, mb: 2, bgcolor: '#fff', borderRadius: 1 }}>
          <Grid2 container columnSpacing={4}>
            <Grid2 size={5} sx={{ py: 3 }}>
              <Box sx={{ position: 'relative', height: '400px' }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}>
                  {/* {selectedSku ? (
                    <SkeletonImage
                      src={selectedSku?.imageUrl}
                      alt='Selected Option'
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : null} */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '400px',
                      // display: selectedSku?.imageUrl ? 'none' : 'block',
                    }}>
                    <MainSwiper
                      data={productImageList}
                      thumbsSwiper={thumbsSwiper}
                      setMainSwiper={mainSwiperRef}
                    />
                  </Box>
                </Box>
              </Box>
              <Box mb={1} />
              <Box>
                <ThumbSwiper
                  images={productImageList}
                  setThumbsSwiper={setThumbsSwiper}
                />
              </Box>
            </Grid2>
            <Grid2 size={7} sx={{ pl: 3, borderLeft: '1px solid #eee' }}>
              <Box sx={{ pt: 3 }}>
                <Typography sx={{ mb: 1, fontSize: 24, fontWeight: 600 }}>
                  {data?.data?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    5.0 <StarRateIcon sx={{ color: '#F19B4C', fontSize: 20 }} />
                  </Typography>
                  <AppLink href={'/'} sx={{ fontSize: 14 }}>
                    Xem đánh giá
                  </AppLink>
                </Box>
                <Typography sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>
                  {data?.data?.skus?.length && selectedSku !== null
                    ? formatPrice(selectedSku?.price ?? 0)
                    : formatPrice(getLowestPrice() ?? 0)}
                </Typography>
                {Object.entries(attributeOptions).map(([type, values]) => (
                  <Box
                    key={type}
                    sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography
                      component={'h3'}
                      sx={{
                        width: 100,
                        flexShrink: 0,
                        fontSize: 14,
                        color: '#757575',
                      }}>
                      {attributeLabels[type]}
                    </Typography>
                    <ToggleButtonGroup
                      sx={{
                        flexWrap: 'wrap',
                        '& .MuiButtonBase-root': {
                          border: '1px solid rgba(0, 0, 0, 0.12)',
                        },
                      }}
                      value={selectedAttributes[type]}
                      exclusive
                      rel=''
                      onChange={(e, newValue) =>
                        handleAttributeChange(type, newValue)
                      }>
                      {values.map((value) => (
                        <ToggleButton
                          sx={{
                            px: 1.5,
                            mt: 1.5,
                            mr: 1.5,
                            color: 'rgba(0,0,0,.8)',
                            fontSize: '14px',
                            textTransform: 'capitalize',
                          }}
                          size='small'
                          key={value}
                          value={value}
                          disabled={handleDisableAttribute(type, value)}>
                          {value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                ))}

                <Grid2 container mt={4} mb={3}>
                  <Grid2 size={2}>Số lượng:</Grid2>
                  <Grid2 size={10} display={'flex'}>
                    <ButtonGroup
                      variant='outlined'
                      size='small'
                      // disabled={isOutOfStock || selectedSku === null}
                      sx={{ mr: 2, height: 32 }}>
                      <Button
                        onClick={() => handleCountChange((count ?? 0) - 1)}
                        disabled={!selectedSku}>
                        -
                      </Button>
                      <TextField
                        sx={{
                          width: '48px',
                          '.MuiInputBase-root': {
                            height: 32,
                            borderRadius: 0,
                            '.MuiInputBase-input': {
                              p: 0,
                              textAlign: 'center',
                              '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
                                {
                                  display: 'none',
                                },
                            },
                          },
                        }}
                        type='number'
                        // disabled={isOutOfStock || selectedSku === null}
                        value={count ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (selectedSku && +value > selectedSku?.quantity) {
                            setCount(selectedSku?.quantity);
                          } else {
                            setCount(value ? parseInt(value, 10) : null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-') {
                            e.preventDefault();
                          }
                          if (
                            count === null &&
                            (e.key === '0' || e.key === 'Enter')
                          ) {
                            e.preventDefault();
                          }
                        }}
                        disabled={!selectedSku}
                        size='small'
                      />
                      <Button
                        onClick={() => handleCountChange((count ?? 0) + 1)}
                        disabled={
                          count === selectedSku?.quantity || !selectedSku
                        }
                        // disabled={isOutOfStock || selectedSku === null}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                    <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                      {selectedSku ? selectedSku?.quantity : totalStock} sản
                      phẩm có sẵn
                    </Typography>
                  </Grid2>
                  {/* {addCartError && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                      Vui lòng chọn phân loại hàng
                    </Typography>
                  )}
                  {addQuantityError && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                      Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
                    </Typography>
                  )} */}
                </Grid2>
                <Box>
                  <Button
                    sx={{ mr: 2, bgcolor: '#f0f0f0' }}
                    variant='outlined'
                    size='large'
                    // disabled={
                    //   (product?.tier_variations?.length === 0 &&
                    //     product?.models?.[0]?.stock === 0) ||
                    //   matchedModel?.stock === 0 ||
                    //   isLoading === true
                    // }
                    onClick={handleAddCartItem}>
                    <ShoppingCartOutlinedIcon />
                  </Button>
                  <Button
                    sx={{ width: 200 }}
                    variant='contained'
                    size='large'
                    disabled={!selectedSku}
                    // onClick={handleBuyBtn}
                  >
                    Mua ngay
                  </Button>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
        <Box sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Chi tiết sản phẩm
          </Typography>
          <Grid2 container spacing={1.5} ml={2} mb={3}>
            <Grid2 size={2}>Danh mục</Grid2>
            <Grid2 size={10}>{data?.data?.category?.name}</Grid2>
            <Grid2 size={2}>Thương hiệu</Grid2>
            <Grid2 size={10}>{data?.data?.brand}</Grid2>
            <Grid2 size={2}>Bảo hành</Grid2>
            <Grid2 size={10}>{data?.data?.details?.guarantee}</Grid2>
            <Grid2 size={2}>Chất liệu</Grid2>
            <Grid2 size={10}>{data?.data?.details?.material}</Grid2>
          </Grid2>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Mô tả sản phẩm
          </Typography>
          <HtmlRenderBox html={data?.data?.description ?? ''} />
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetailPage;
