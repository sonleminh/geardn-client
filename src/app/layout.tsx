import React from 'react';
import { Inter } from 'next/font/google';
import ColorModeProvider from '@/providers/color-mode-store-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CssBaseLineClient from '@/components/common/CssBaseLine';
import { Providers } from '@/lib/utils/ProviderQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material';
import theme from '@/theme';

const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              {/* <ThemeProvider theme={theme}> */}
              <ColorModeProvider>
                <CssBaseline />
                {children}
              </ColorModeProvider>
              {/* </ThemeProvider> */}
            </GoogleOAuthProvider>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
