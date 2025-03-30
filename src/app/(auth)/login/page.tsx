import { LoadingCircle } from '@/components/common/LoadingCircle';
import React, { Suspense } from 'react';
import LoginPage from './LoginPage';

const Login = () => {
  return (
    <Suspense fallback={<LoadingCircle />}>
      <LoginPage />;
    </Suspense>
  );
};

export default Login;
