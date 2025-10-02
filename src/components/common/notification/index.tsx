'use client';

import { useNotificationStore } from '@/stores/notification-store';
import { Alert, Snackbar } from '@mui/material';

export const Notification = () => {
  const { message, severity, open, closeNotification } = useNotificationStore();

  const text =
    typeof message === 'string'
      ? message
      : // nếu API trả object, cố gắng rút message hợp lý
        (message as any)?.message ?? (message ? JSON.stringify(message) : '');

  if (!open) return null;

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={closeNotification}>
      <Alert variant='filled' severity={severity}>
        {text}
      </Alert>
    </Snackbar>
  );
};
