'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  Box,
  Button,
  Grid2,
  List,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import SkeletonImage from '../common/SkeletonImage';

import LOGO from '@/assets/geardn-logo.png';
import { ROUTES } from '@/constants/route';
import { useSession } from '@/hooks/useSession';
import { IUser } from '@/interfaces/IUser';
import { useCartStore } from '@/stores/cart-store';
import AppLink from '../common/AppLink';
import { HeaderStyle } from './style';
import { useLogout } from '@/queries/auth';
import { AppError } from '@/lib/errors/app-error';
import { useNotificationStore } from '@/stores/notification-store';

const Header = ({ initialUser }: { initialUser?: IUser | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { showNotification } = useNotificationStore();

  const { cartItems } = useCartStore((state) => state);

  const { data } = useSession();
  const { mutateAsync: onLogout } = useLogout();
  const userData = data?.data ?? initialUser;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsExpanded(window.scrollY > 720);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProductList = () => {
    const productList = document.getElementById('shop');
    if (productList) {
      productList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/#shop');
    }
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      router.push(ROUTES.LOGIN);
    } catch (error) {
      const e = AppError.fromUnknown(error);
      showNotification(e?.message, 'error');
    }
  };
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!userData) {
      router.push(ROUTES.LOGIN);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <Box sx={HeaderStyle(isExpanded, pathname)}>
      <Box className='header-main'>
        <Grid2 container height={80}>
          <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <AppLink href={'/'}>
              <Box className='header-logo'>
                <SkeletonImage
                  src={LOGO}
                  alt='geardn'
                  fill
                  quality={90}
                  priority
                />
              </Box>
            </AppLink>
          </Grid2>
          <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <List
              sx={{
                display: 'flex',
                width: '100%',
                '> li': {
                  justifyContent: 'center',
                  ':hover': {
                    ' p': {
                      ':before': {
                        transform: 'scaleX(1)',
                      },
                    },
                  },
                  ' p': {
                    position: 'relative',
                    cursor: 'pointer',
                    ':before': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      bgcolor: '#000',
                      transition: 'transform .2s',
                      transform: 'scaleX(0)',
                      transformOrigin: 'top left',
                    },
                  },
                },
              }}>
              <ListItem>
                <Typography>Danh mục</Typography>
              </ListItem>
              <ListItem>
                <Typography onClick={scrollToProductList}>Shop</Typography>
              </ListItem>
              <ListItem>
                <Typography>Liên hệ</Typography>
              </ListItem>
            </List>
          </Grid2>
          <Grid2 size={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                width: '100%',
              }}>
              <SearchIcon />
              <Button
                sx={{ position: 'relative', minWidth: 40, height: 40, ml: 2 }}
                onClick={() => router.push(ROUTES.CART)}>
                <ShoppingCartOutlinedIcon />
                <Typography
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: '#000',
                    // bgcolor: isLoading ? 'rgba(0, 0 ,0, 0.3)' : '#000',
                    color: '#fff',
                  }}>
                  {cartItems ? cartItems?.length : 0}
                  {/* {cartItems ? cartItems.length : isLoading ? '' : 0} */}
                </Typography>
              </Button>
              {userData !== null ? (
                userData?.picture ? (
                  <Button
                    sx={{}}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleUserClick(e)
                    }>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '30px',
                        height: '30px',
                        mr: 1,
                        overflow: 'hidden',
                        borderRadius: 20,
                        '& img': {
                          objectFit: 'cover',
                        },
                      }}>
                      <SkeletonImage
                        src={userData?.picture}
                        alt='geardn'
                        fill
                      />
                    </Box>
                    <Typography sx={{ fontSize: 14, textTransform: 'none' }}>
                      {userData?.name}
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    disableRipple
                    disableFocusRipple
                    sx={{
                      minWidth: 40,
                      height: 40,
                      bgcolor: 'transparent',
                      '&:hover': { backgroundColor: 'transparent' },
                    }}
                    onClick={handleUserClick}>
                    <AccountCircleIcon
                      sx={{ mr: 0.5, ml: 1.5, fontSize: 32 }}
                    />
                    <Typography sx={{ fontSize: 14, textTransform: 'none' }}>
                      {userData?.name}
                    </Typography>
                  </Button>
                )
              ) : (
                <Button
                  sx={{ width: 40, minWidth: 40, height: 40, ml: 1 }}
                  className='user-icon'
                  onClick={handleUserClick}>
                  <AccountCircleIcon sx={{ fontSize: 30 }} />
                </Button>
              )}
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                disableScrollLock={true}>
                <MenuItem onClick={() => router.push(ROUTES.ACCOUNT)}>
                  Tài khoản của tôi
                </MenuItem>
                <MenuItem onClick={() => router.push(ROUTES.PURCHASE)}>
                  Đơn mua
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Header;
