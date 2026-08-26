import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.scss';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Header } from '@/components/header/header';
import { ToastProvider } from '@/components/toast/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Books online',
  description: 'View and browse books online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ToastProvider>
            <Header></Header>
            {children}
          </ToastProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
