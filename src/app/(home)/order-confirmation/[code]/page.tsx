import { Box } from '@mui/material';
import { fetchOrder } from '@/data/order.server';
import OrderConfirmationClient from './OrderComfirmationClient';

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const orderData = await fetchOrder({ code, revalidate: 0 });

  return (
    <Box>
      <OrderConfirmationClient data={orderData.data} />
    </Box>
  );
}
