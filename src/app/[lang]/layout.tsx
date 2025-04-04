import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';

import { AppSnackbar } from '@/components/AppSnackbar';
import { CONFIG } from '@/config';
import '@/styles/style.css';
import { Params } from '@/types/paramsType';
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

declare module '@mui/material/styles' {
  interface Theme {
    type: 'light' | 'semi-dark' | 'dark';
    sidebar: {
      bgimage: string;
      overlay: {
        bgcolor: string;
        bgimage: string;
        opacity: number;
      };
    };
    jumboComponents: {
      JumboNavbar: {
        nav: {
          action: {
            active: string;
            hover: string;
          };
          background: {
            active: string;
            hover: string;
          };
          tick: {
            active: string;
            hover: string;
          };
        };
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    type?: 'light' | 'semi-dark' | 'dark';
    sidebar?: {
      bgimage?: string;
      overlay?: {
        bgcolor?: string;
        bgimage?: string;
        opacity?: number;
      };
    };
    jumboComponents?: {
      JumboNavbar?: {
        nav?: {
          action?: {
            active?: string;
            hover?: string;
          };
          background?: {
            active?: string;
            hover?: string;
          };
          tick?: {
            active?: string;
            hover?: string;
          };
        };
      };
    };
  }
}

export async function generateStaticParams() {
  return [{ lang: 'en-US' }];
}

export const metadata: Metadata = {
  title: "ProsERP",
  icons: {
    icon: "/assets/images/logos/favicon.ico", // Fallback icon
    shortcut: "/assets/images/logos/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#6200EE",
    "theme-color": "#2113AD",
    keywords: "Robust ERP, ProsERP, Accounts, Project Management, Inventory Management, Payroll, Requisitions",
  },
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
  } & Params
) {
  const params = await props.params;

  const { children } = props;

  const { lang } = params;
  return (
    <html lang={lang} data-lt-installed='true'>
      <body cz-shortcut-listen='true'>
        <div id='root'>
          <Providers>
            <AppRouterCacheProvider>
              <JumboConfigProvider LinkComponent={Link}>
                <JumboTheme init={CONFIG.THEME}>
                  <CssBaseline />
                  <JumboDialogProvider>
                    <JumboDialog />
                    <AppSnackbar>{children}</AppSnackbar>
                  </JumboDialogProvider>
                </JumboTheme>
              </JumboConfigProvider>
            </AppRouterCacheProvider>
          </Providers>

        </div>
      </body>
    </html>
  );
}
