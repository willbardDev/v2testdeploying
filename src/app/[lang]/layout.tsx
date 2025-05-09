import type { Metadata } from 'next';
import '@/styles/style.css';
import '@assets/fonts/noir-pro/styles.css';
import { ReactNode } from 'react';
import { Providers } from '../providers';
import { getDictionary } from './dictionaries';
import { DictionaryProvider } from './contexts/DictionaryContext';

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
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} data-lt-installed='true'>
      <body cz-shortcut-listen='true'>
        <div id='root'>
        <DictionaryProvider dictionary={dictionary}>
          <Providers>
            {children}
          </Providers>
        </DictionaryProvider>
        </div>
      </body>
    </html>
  );
}