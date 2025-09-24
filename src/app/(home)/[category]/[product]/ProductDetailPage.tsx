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

import { IProductSkuAttributes, ISku } from '@/interfaces/IProductSku';
import { formatPrice } from '@/utils/format-price';
import { attributeLabels } from '@/constants/attributeLabels';

import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { ATTRIBUTE_ORDER } from '@/constants/attributeOrder';
import { useNotificationStore } from '@/stores/notification-store';
import { IProduct } from '@/interfaces/IProduct';
import SkeletonImage from '@/components/common/SkeletonImage';

const ProductDetailPage = ({ data }: { data: IProduct }) => {
  const params = useParams();
  const product = params.product as string;
  const { user } = useAuthStore();
  const { cartItems, addToCart, removeItem, updateQuantity } = useCartStore();
  const { mutateAsync: onAddToCart } = useAddToCart();
  const { showNotification } = useNotificationStore();

  const [count, setCount] = useState<number | null>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const mainSwiperRef = useRef<SwiperClass | null>(null);

  const productImageList = useMemo(() => {
    return [
      ...(data?.images || []),
      ...(data && data?.skus?.length > 1
        ? data?.skus.map((sku) => sku.imageUrl)
        : []),
    ];
  }, [data?.images, data?.skus]);

  const attributeOptions = useMemo(() => {
    if (!data) return {};

    const options: Record<string, string[]> = {};
    data?.skus?.forEach((sku) => {
      sku?.productSkuAttributes?.forEach(({ attributeValue }) => {
        if (!options[attributeValue?.attribute?.name]) {
          options[attributeValue?.attribute?.name] = [];
        }
        if (
          !options[attributeValue?.attribute?.name].includes(
            attributeValue.value
          )
        ) {
          options[attributeValue?.attribute?.name].push(attributeValue.value);
        }
      });
    });

    const order = ATTRIBUTE_ORDER[data?.category?.name] ?? Object.keys(options);

    const sortedOptions: Record<string, string[]> = {};
    order.forEach((key) => {
      if (options[key]) {
        sortedOptions[key] = options[key];
      }
    });

    return sortedOptions;
  }, [data]);

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
      data?.skus?.find((sku) =>
        Object.entries(selectedAttributes).every(([key, value]) =>
          sku.productSkuAttributes.some(
            (productSkuAttributes: IProductSkuAttributes) =>
              productSkuAttributes.attributeValue.attribute.name === key &&
              productSkuAttributes.attributeValue.value === value
          )
        )
      ) ?? null
    );
  }, [selectedAttributes, data?.skus]);

  const availableCombinations = data?.skus?.map((sku) =>
    sku.productSkuAttributes.reduce(
      (
        acc: Record<string, string>,
        productSkuAttributes: IProductSkuAttributes
      ) => {
        acc[productSkuAttributes.attributeValue.attribute.name] =
          productSkuAttributes.attributeValue.value;
        return acc;
      },
      {} as Record<string, string>
    )
  );

  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };

      if (newAttributes[type] === value) {
        delete newAttributes[type]; // Nếu đã chọn, thì bỏ chọn
      } else {
        newAttributes[type] = value; // Nếu chưa chọn, thì chọn
      }
      setCount(1);
      return newAttributes;
    });
  };

  const handleDisableAttribute = useMemo(() => {
    return (type: string, value: string) => {
      if (totalStock === 0) return true;
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
        itemAdded?.quantity + (count ?? 1) > (selectedSkuStock ?? 0)
      ) {
        return showNotification(
          `Bạn đã có ${itemAdded?.quantity} trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá số lượng trong kho.`,
          'error'
        );
      }

      return addToCart({
        productId: selectedSku?.productId,
        skuId: selectedSku?.id,
        productName: data?.name,
        imageUrl:
          selectedSku?.imageUrl !== ''
            ? selectedSku?.imageUrl
            : data?.images?.[0],
        price: selectedSku?.sellingPrice,
        quantity: count ?? 1,
        attributes: selectedSku?.productSkuAttributes.map(
          (productSkuAttributes: IProductSkuAttributes) => ({
            attributeId: productSkuAttributes.attributeValue.attribute.id,
            value: productSkuAttributes.attributeValue.value,
          })
        ),
      });
    }

    if (user && data) {
      const newItem = {
        productId: selectedSku?.productId,
        skuId: selectedSku?.id,
        productName: data?.name,
        imageUrl:
          selectedSku?.imageUrl !== ''
            ? selectedSku?.imageUrl
            : data?.images?.[0],
        price: selectedSku?.sellingPrice,
        quantity: count ?? 1,
        attributes: selectedSku?.productSkuAttributes.map(
          (productSkuAttributes: IProductSkuAttributes) => ({
            attributeId: productSkuAttributes.attributeValue.attribute.id,
            value: productSkuAttributes.attributeValue.value,
          })
        ),
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
    { href: `/product/${product}`, label: data?.name as string },
  ];

  const totalStock = data?.skus?.reduce(
    (acc, sku) =>
      acc +
      (sku.stocks?.reduce(
        (acc: number, stock: { id: number; quantity: number }) =>
          acc + stock.quantity,
        0
      ) || 0),
    0
  );

  const selectedSkuStock = useMemo(() => {
    return selectedSku?.stocks?.reduce(
      (acc: number, stock: { id: number; quantity: number }) =>
        acc + stock.quantity,
      0
    );
  }, [selectedSku]);

  console.log('selectedSku', selectedSku);

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
                  {selectedSku?.imageUrl ? (
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
                  ) : null}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '400px',
                      display: selectedSku?.imageUrl ? 'none' : 'block',
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
                  {data?.name}
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
                  {data?.skus?.length && selectedSku !== null
                    ? formatPrice(selectedSku?.sellingPrice ?? 0)
                    : formatPrice(data?.priceMin ?? 0)}
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
                      {attributeLabels[type]}:
                    </Typography>
                    <ToggleButtonGroup
                      sx={{
                        flexWrap: 'wrap',
                        '& .MuiButtonBase-root': {
                          border: '1px solid rgba(0, 0, 0, 0.12)',
                          borderRadius: '2px',
                        },
                        '& .MuiToggleButton-root.Mui-disabled': {
                          border: '1px solid rgba(0,0,0,.12)',
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
                            minWidth: 69,
                            px: 1.5,
                            mt: 1,
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
                      sx={{ mr: 2, height: 32 }}>
                      <Button
                        onClick={() => handleCountChange((count ?? 0) - 1)}
                        disabled={!selectedSku || count === 1}>
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
                        disabled={
                          selectedSku === null ||
                          selectedSkuStock === 0 ||
                          totalStock === 0
                        }
                        value={count ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (selectedSku && +value > selectedSkuStock) {
                            setCount(selectedSkuStock);
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
                        size='small'
                      />
                      <Button
                        onClick={() => handleCountChange((count ?? 0) + 1)}
                        disabled={!selectedSku || count === selectedSkuStock}>
                        +
                      </Button>
                    </ButtonGroup>
                    {totalStock > 0 && (
                      <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                        {totalStock > 0 && selectedSku
                          ? selectedSku?.stocks?.reduce(
                              (
                                acc: number,
                                stock: { id: number; quantity: number }
                              ) => acc + stock.quantity,
                              0
                            )
                          : totalStock}{' '}
                        sản phẩm có sẵn
                      </Typography>
                    )}
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
                    disabled={!selectedSku}
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
                    {totalStock > 0 ? 'Mua ngay' : 'Hết hàng'}
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
            <Grid2 size={10}>{data?.category?.name}</Grid2>
            <Grid2 size={2}>Thương hiệu</Grid2>
            <Grid2 size={10}>{data?.brand}</Grid2>
            <Grid2 size={2}>Bảo hành</Grid2>
            <Grid2 size={10}>{data?.details?.guarantee}</Grid2>
            <Grid2 size={2}>Chất liệu</Grid2>
            <Grid2 size={10}>{data?.details?.material}</Grid2>
          </Grid2>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Mô tả sản phẩm
          </Typography>
          <HtmlRenderBox html={data?.description ?? ''} />
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetailPage;
