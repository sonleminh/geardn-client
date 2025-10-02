'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { toFormikValidationSchema } from 'zod-formik-adapter';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';

import SkeletonImage from '@/components/common/SkeletonImage';
import { ICustomJwtPayload } from '@/interfaces/IAuth';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useNotificationStore } from '@/stores/notification-store';
import { ROUTES } from '@/constants/route';
import { loginWithEmailPwd } from '@/apis/auth';
import { IProductSkuAttributes } from '@/interfaces/IProductSku';
import { useSyncCart } from '@/queries/cart';
import { loginSchema } from '@/features/auth/schemas/login.schema';
import { useLoginWithEmailPwd } from '@/queries/auth';

const LoginPage = () => {
  const router = useRouter();
  const { cartItems, syncCart } = useCartStore();
  // const { login } = useAuthStore((state) => state);
  const { showNotification } = useNotificationStore();
  const { mutateAsync: onSyncCart } = useSyncCart();
  const { mutateAsync: onLoginWithEmailPwd } = useLoginWithEmailPwd();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const syncPayload = cartItems?.map(
          ({ productId, skuId, quantity }) => ({
            productId,
            skuId,
            quantity,
          })
        );
        const updatedCart = await onSyncCart({ items: syncPayload });

        const syncCartData = updatedCart?.data?.items?.map((item) => ({
          productId: item?.productId,
          skuId: item?.sku?.id,
          productName: item?.product?.name,
          imageUrl: item?.sku?.imageUrl
            ? item?.sku?.imageUrl
            : item?.product?.images?.[0],
          sellingPrice: item?.sku?.sellingPrice,
          quantity: item?.quantity,
          attributes: item?.sku?.productSkuAttributes.map(
            (productSkuAttribute: IProductSkuAttributes) => ({
              attribute: productSkuAttribute?.attributeValue?.attribute?.name,
              attributeValue: productSkuAttribute?.attributeValue?.value,
            })
          ),
          cartItemId: item?.id,
        }));
        syncCart(syncCartData);
        // login({
        //   id: userData?.data?.id,
        //   email: userData?.data?.email,
        //   name: userData?.data?.name,
        //   picture: userData?.data?.picture,
        // });
        router.push('/');
        showNotification('Đăng nhập thành công', 'success');
      } catch (error) {
        // showNotification(error?.message, 'error');
      }
    },
  });
  // try {
  //   const userData = await loginWithEmailPwd({
  //     email: values.email,
  //     password: values.password,
  //   });
  // onSuccess: async () => {

  //   if (userData?.data?.id) {
  //     router.push('/');
  //     // router.push('/tai-khoan');
  //     showNotification('Đăng nhập thành công', 'success');
  //   }
  // },
  // onError: (error) => {
  //   let message = 'Đã xảy ra lỗi không xác định';
  //   // Check nếu là AxiosError
  //   if (error instanceof AxiosError) {
  //     const status = error.response?.status;
  //     const backendMsg = error.response?.data?.message;
  //     if (status === 404) {
  //       message =
  //         'Không tìm thấy tài khoản hoặc địa chỉ API không tồn tại.';
  //     } else if (status === 401) {
  //       message = 'Sai mật khẩu. Vui lòng thử lại.';
  //     } else if (status === 400) {
  //       message =
  //         typeof backendMsg === 'string'
  //           ? backendMsg
  //           : Array.isArray(backendMsg)
  //           ? backendMsg.join(', ')
  //           : 'Yêu cầu không hợp lệ.';
  //     } else if (backendMsg) {
  //       message = backendMsg;
  //     }
  //   }
  //   console.log('error', message);
  //   return showNotification(message, 'error');
  // },
  // });
  // } catch (error) {
  //   console.error('Unexpected error in onSubmit:', error);
  //   showNotification('Hệ thống gặp lỗi. Vui lòng thử lại sau.', 'error');
  // }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    const credentialDecoded: ICustomJwtPayload = jwtDecode(
      credentialResponse?.credential as string
    );

    console.log('cre:', credentialDecoded);

    if (credentialResponse) {
      Cookies.set('GC', credentialResponse?.credential as string, {
        expires: credentialDecoded?.exp,
      });
      // login({
      //   id: credentialDecoded?.sub,
      //   email: credentialDecoded?.email as string,
      //   name: credentialDecoded?.name as string,
      //   picture: credentialDecoded?.picture,
      // });
      router.push('/');
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        bgcolor: '#D7D6D9',
      }}>
      <Box
        sx={{
          width: 1000,
          mx: 'auto',
          bgcolor: '#fff',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
        <Grid2 container spacing={4}>
          <Grid2 size={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '500px' },
                overflow: 'hidden',
                '& img': {
                  objectFit: 'cover',
                },
              }}>
              <SkeletonImage src={'/setup-background.jpg'} alt='geardn' />
            </Box>
          </Grid2>
          <Grid2
            size={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: '20px 40px 20px 0',
            }}>
            <Box>
              <Box>
                <Typography
                  sx={{
                    mb: 1,
                    fontSize: 20,
                    fontWeight: 600,
                  }}>
                  Welcome to GearDN
                </Typography>
                {/* <Typography sx={{ fontSize: 14, color: '#ababab' }}>
              Đăng nhập
            </Typography> */}
              </Box>
              <Box>
                <FormControl
                  fullWidth
                  variant='standard'
                  sx={{ maxHeight: 100 }}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    name='email'
                    placeholder='username@gmail.com'
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Person2OutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      <Typography
                        component={'span'}
                        sx={{ fontSize: 13, color: 'red' }}>
                        {formik.errors.email}
                      </Typography>
                    }
                    onChange={handleChange}
                    sx={{ mt: 6, borderRadius: 4 }}
                  />
                </FormControl>
                <FormControl fullWidth variant='standard'>
                  <InputLabel>Mật khẩu</InputLabel>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='*******'
                    autoFocus
                    helperText={
                      <Typography
                        component={'span'}
                        sx={{ fontSize: 13, color: 'red' }}>
                        {formik.errors.password}
                      </Typography>
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='start'>
                          {formik.values.password ? (
                            <Box
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}>
                              {showPassword ? (
                                <Visibility sx={{ fontSize: 20 }} />
                              ) : (
                                <VisibilityOff sx={{ fontSize: 20 }} />
                              )}
                            </Box>
                          ) : (
                            <></>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        formik.handleSubmit();
                      }
                    }}
                    onChange={handleChange}
                    sx={{ mt: 6, borderRadius: 4 }}
                  />
                </FormControl>
                <Button
                  variant='contained'
                  fullWidth
                  sx={{ height: 48, mt: 3 }}
                  disabled={!formik.values.email || !formik.values.password}
                  onClick={() => formik.handleSubmit()}>
                  Đăng nhập
                </Button>
              </Box>
            </Box>
            <GoogleLogin
              onSuccess={(credentialResponse: CredentialResponse) => {
                handleGoogleLogin(credentialResponse);
                // const credentialDecoded = jwtDecode(
                //   credentialResponse.credential as string
                // );
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            <Typography sx={{ mb: 2 }}>
              Bạn chưa có tài khoản?{' '}
              <Link href={ROUTES.SIGNUP}>
                {' '}
                <Typography component={'span'}>Đăng ký</Typography>
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default LoginPage;
