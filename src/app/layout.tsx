import React from 'react';
import { Inter } from 'next/font/google';
import ColorModeProvider from '@/providers/color-mode-store-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CssBaseLineClient from '@/components/common/CssBaseLine';

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
    <html lang='en'>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId='74957006221-6mm4u0inm5drqgrt1hpoiagugbuhoav6.apps.googleusercontent.com'>
          <ColorModeProvider>
            <CssBaseLineClient />
            {children}
          </ColorModeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
