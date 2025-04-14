import SkeletonImage from '@/components/common/SkeletonImage';
import { OrderStatus, OrderStatusLabelMap } from '@/constants/orderStatus';
import { IOrder } from '@/interfaces/IOrder';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

const PurchaseList = ({ orders }: { orders: IOrder[] }) => {
  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }
  return (
    <Box>
      {orders.map((order) => (
        <Box
          key={order.id}
          sx={{
            marginBottom: 1.5,
            bgcolor: '#fff',
            borderRadius: '8px',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb',
              p: '12px 16px',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(order?.createdAt).format('DD/MM/YYYY')}{' '}
              </Typography>
              <Box sx={DotStyle} />
              <Typography sx={{ fontSize: 14 }}>
                {order?.shipment?.method === 1
                  ? 'Nhận tại cửa hàng'
                  : 'Giao hàng tận nơi'}{' '}
              </Typography>
              <Box sx={DotStyle} />
              <Typography sx={{ fontSize: 14 }}>
                {order?.orderItems?.length} sản phẩm
              </Typography>
            </Box>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#059669',
                fontSize: 14,
                fontWeight: 600,
              }}>
              <Typography
                component={'span'}
                sx={{
                  display: 'inline-block',
                  width: '8px !important',
                  height: '8px !important',
                  mr: 1,
                  bgcolor: '#059669',
                  borderRadius: '50%',
                }}
              />
              {OrderStatusLabelMap[order?.status as OrderStatus]}
            </Typography>
          </Box>
          {order?.orderItems?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                p: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
              }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '80px',
                  height: { xs: '80px' },
                  overflow: 'hidden',
                  '& img': {
                    objectFit: 'cover',
                  },
                }}>
                <SkeletonImage
                  src={item?.sku?.imageUrl ?? item.product?.images?.[0]}
                  alt='geardn'
                />
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                  {item.product?.name}
                </Typography>
              </Box>
            </Box>
          ))}
          <div>Total: {order.totalPrice} VND</div>
          <div>Status: {order.status}</div>
          {/* Add more fields as needed */}
        </Box>
      ))}
    </Box>
  );
};

export default PurchaseList;

const DotStyle: SxProps<Theme> = {
  display: 'inline-block',
  width: '4px',
  height: '4px',
  mx: 1,
  bgcolor: '#e5e7eb',
  borderRadius: '50%',
};
