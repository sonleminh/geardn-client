'use client';

import LayoutContainer from '@/components/common/sharing/layout-container';
import { Box, Grid2 } from '@mui/material';
import React, { useMemo, useRef, useState } from 'react';
import MainSwiper from '../main-swiper';
import ThumbSwiper from '../thumb-swiper';
import { TProductRes } from '@/services/product/api';
import { SwiperClass } from 'swiper/react';

const ProductMain = ({ product }: { product: TProductRes }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const mainSwiperRef = useRef<SwiperClass | null>(null);

  const productImageList = useMemo(() => {
    return [
      ...(product?.data?.images || []),
      ...(product?.data?.skus.map((sku) => sku.imageUrl) || []),
    ];
  }, [product?.data?.images, product?.data?.skus]);
  return (
    <Box pt={2} pb={4} bgcolor={'#eee'}>
      <LayoutContainer>
        c
        {/* <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box> */}
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
                    {/* <MainSwiper
                      data={productImageList}
                      thumbsSwiper={thumbsSwiper}
                      setMainSwiper={mainSwiperRef}
                    />*/}
                  </Box>
                </Box>
              </Box>
              <Box mb={1} />
              <Box>
                {/* <ThumbSwiper
                  images={productImageList}
                  setThumbsSwiper={setThumbsSwiper}
                /> */}
              </Box>
            </Grid2>
            {/* <Grid2 size={7} sx={{ pl: 3, borderLeft: '1px solid #eee' }}>
              <Box sx={{ pt: 3 }}>
                <Typography sx={{ mb: 1, fontSize: 24, fontWeight: 600 }}>
                  {product?.name}
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
                  {product?.skus?.length && selectedSku !== null
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
                      disabled={isOutOfStock || selectedSku === null}
                      sx={{ mr: 2, height: 32 }}>
                      <Button
                        onClick={() => handleCountChange((count ?? 0) - 1)}>
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
                        disabled={isOutOfStock || selectedSku === null}
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
                        size='small'
                      />
                      <Button
                        onClick={() => handleCountChange((count ?? 0) + 1)}
                        disabled={count === selectedSku?.quantity}
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
                  {addCartError && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                      Vui lòng chọn phân loại hàng
                    </Typography>
                  )}
                  {addQuantityError && (
                    <Typography sx={{ mt: 1, fontSize: 14, color: 'red' }}>
                      Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này
                    </Typography>
                  )}
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
                    disabled={isOutOfStock || matchedModel?.stock === 0}
                    // onClick={handleBuyBtn}
                  >
                    {isOutOfStock || matchedModel?.stock === 0
                      ? 'Hết hàng'
                      : 'Mua ngay'}
                  </Button>
                </Box>
              </Box>
            </Grid2> */}
          </Grid2>
        </Box>
        {/* <Box sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Chi tiết sản phẩm
          </Typography>
          <Grid2 container spacing={1.5} ml={2} mb={3}>
            <Grid2 size={2}>Danh mục</Grid2>
            <Grid2 size={10}>{product?.category?.name}</Grid2>
            <Grid2 size={2}>Thương hiệu</Grid2>
            <Grid2 size={10}>{product?.brand}</Grid2>
            <Grid2 size={2}>Bảo hành</Grid2>
            <Grid2 size={10}>{product?.details?.guarantee}</Grid2>
            <Grid2 size={2}>Chất liệu</Grid2>
            <Grid2 size={10}>{product?.details?.material}</Grid2>
          </Grid2>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Mô tả sản phẩm
          </Typography>
          <HtmlRenderBox html={product?.description} />
        </Box> */}
      </LayoutContainer>
    </Box>
  );
};

export default ProductMain;
