import type { Metadata } from 'next';
import '@/styles/style.css';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import '@assets/fonts/noir-pro/styles.css';
import { ReactNode } from 'react';
import { Providers } from '../providers';

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

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = params;

  return (
    <html lang={lang} data-lt-installed='true'>
      <body cz-shortcut-listen='true'>
        <div id='root'>
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}