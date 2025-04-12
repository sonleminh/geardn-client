'use client';

import React, { Suspense } from 'react';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Avatar, Box, Divider, Grid2, Typography } from '@mui/material';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import EditIcon from '@mui/icons-material/Edit';

import { LoadingCircle } from '@/components/common/LoadingCircle';
import LayoutContainer from '@/components/layout-container';
import AppLink from '@/components/common/AppLink';

import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/constants/route';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuthStore();
  return (
    <Suspense fallback={<LoadingCircle />}>
      <Box pt={2} pb={4}>
        <LayoutContainer>
          <Grid2 container spacing={2}>
            <Grid2 size={2}>
              <Box
                sx={{
                  p: '20px 0',
                }}>
                <Box sx={{ display: 'flex' }}>
                  <Avatar
                    alt='Remy Sharp'
                    src='https://down-vn.img.susercontent.com/file/f1001ba33eca96416ee5e1e82e784151'
                    sx={{ width: '24px', height: '24px', mr: 2 }}
                  />
                  <Box>
                    <Typography
                      sx={{ mb: '2px', fontSize: 14, fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', color: '#888' }}>
                      <EditIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 14 }}>Sửa hồ sơ</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box
                sx={{
                  pt: 1,
                  a: {
                    display: 'flex',
                    alignItems: 'center',
                    p: '6px 0',
                    svg: { mr: 1 },
                    '& p': {
                      textAlign: 'start',
                      fontSize: 14,
                      fontWeight: 500,
                    },
                  },
                }}>
                <Box component={AppLink} href={ROUTES.PURCHASE}>
                  <NotificationsNoneOutlinedIcon />
                  <Typography>Thông báo</Typography>
                </Box>
                <Box component={AppLink} href={ROUTES.ACCOUNT}>
                  <Person2OutlinedIcon />
                  <Typography>Tài khoản của tôi</Typography>
                </Box>
                <Box component={AppLink} href={ROUTES.PURCHASE}>
                  <ListAltOutlinedIcon />
                  <Typography>Đơn mua</Typography>
                </Box>
              </Box>
            </Grid2>
            <Grid2 size={10}>{children}</Grid2>
          </Grid2>
        </LayoutContainer>
      </Box>
    </Suspense>
  );
}
