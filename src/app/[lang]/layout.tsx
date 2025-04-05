import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { AppSnackbar } from '@/components/AppSnackbar';
import { CONFIG } from '@/config';
import '@/styles/style.css';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import '@assets/fonts/noir-pro/styles.css';
import {
  JumboConfigProvider,
  JumboDialog,
  JumboDialogProvider,
  JumboTheme,
} from '@jumbo/components';
import { CssBaseline } from '@mui/material';
import Link from 'next/link';
import Providers from '../providers';
import { AuthInitializer } from '@/components/AuthInitializer/AuthInitializer';
import { ReactNode, Suspense } from 'react';
import { Spinner } from '@/components/Spinner';
import { JumboAuthProvider } from '../providers/JumboAuthProvider';

interface RootLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export async function generateStaticParams() {
  return [{ lang: 'en-US' }];
}

export const metadata: Metadata = {
  title: "ProsERP",
  icons: {
    icon: "/assets/images/logos/favicon.ico",
    shortcut: "/assets/images/logos/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#6200EE",
    "theme-color": "#2113AD",
    keywords: "Robust ERP, ProsERP, Accounts, Project Management, Inventory Management, Payroll, Requisitions",
  },
};

// app/layout.tsx (RootLayout)
export default function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = params;

  return (
    <html lang={lang} data-lt-installed='true'>
      <body cz-shortcut-listen='true'>
        <div id='root'>
          <Providers>
            <JumboAuthProvider>
              <AppRouterCacheProvider>
                <JumboConfigProvider LinkComponent={Link}>
                  <JumboTheme init={CONFIG.THEME}>
                    <CssBaseline />
                    <JumboDialogProvider>
                      <AuthInitializer>
                        <JumboDialog />
                        <AppSnackbar>
                          <Suspense fallback={<Spinner/>}>
                            {children}
                          </Suspense>
                        </AppSnackbar>
                      </AuthInitializer>
                    </JumboDialogProvider>
                  </JumboTheme>
                </JumboConfigProvider>
              </AppRouterCacheProvider>
            </JumboAuthProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}