'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
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
import { useLogout } from '@/apis/auth';

import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';

import LOGO from '@/assets/geardn-logo.png';
import { ROUTES } from '@/constants/route';
import { HeaderStyle } from './style';
import { useGetCart } from '@/apis/cart';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuthStore((state) => state);
  const { cartItems } = useCartStore();

  const { data: cartData, isLoading } = useGetCart(user);
  const { mutateAsync: onLogout } = useLogout();

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
    const result = await onLogout();
    if (result?.success === true) {
      logout();
      router.push(ROUTES.LOGIN);
    }
  };
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (user === null) {
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
            <Link href={'/'}>
              <Box className='header-logo'>
                <SkeletonImage
                  src={LOGO}
                  alt='geardn'
                  fill
                  quality={90}
                  priority
                />
              </Box>
            </Link>
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
                    bgcolor: isLoading ? 'rgba(0, 0 ,0, 0.3)' : '#000',
                    color: '#fff',
                  }}>
                  {cartItems ? cartItems.length : isLoading ? '' : 0}
                </Typography>
              </Button>
              {user !== null ? (
                user?.picture ? (
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
                      <SkeletonImage src={user?.picture} alt='geardn' fill />
                    </Box>
                    <Typography sx={{ fontSize: 14, textTransform: 'none' }}>
                      {user?.name}
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    sx={{ minWidth: 40, height: 40 }}
                    className='usernname-icon'
                    onClick={handleUserClick}>
                    <AccountCircleIcon
                      sx={{ mr: 0.5, ml: 1.5, fontSize: 32 }}
                    />
                    <Typography sx={{ fontSize: 14, textTransform: 'none' }}>
                      {user?.name}
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
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
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
