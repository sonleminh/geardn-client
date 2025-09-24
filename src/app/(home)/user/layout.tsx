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
import { getUserOnServer } from '@/data/profile.server';
import Sidebar from './components/sidebar';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUserOnServer();
  return (
    <Suspense fallback={<LoadingCircle />}>
      <Box pt={2} pb={4}>
        <LayoutContainer>
          <Grid2 container spacing={2}>
            <Grid2 size={2}>
              <Sidebar userData={userData?.data} />
            </Grid2>
            <Grid2 size={10}>{children}</Grid2>
          </Grid2>
        </LayoutContainer>
      </Box>
    </Suspense>
  );
}
