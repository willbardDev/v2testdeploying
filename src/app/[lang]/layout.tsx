import type { Metadata } from 'next';
import '@/styles/style.css';
import '@assets/fonts/noir-pro/styles.css';
import { ReactNode } from 'react';
import { Providers } from '../providers';
import { getDictionary } from './dictionaries';
import { DictionaryProvider } from './contexts/DictionaryContext';
import { LanguageProvider } from './contexts/LanguageContext';

const APP_NAME = 'ProsERP';
const APP_DEFAULT_TITLE = 'ProsERP';
const APP_TITLE_TEMPLATE = '%s | ProsERP';
const APP_DESCRIPTION = 'Robust ERP for accounting, project management, payroll, inventory, and requisitions.';

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
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  themeColor: "#2113AD",
  icons: {
    icon: "/assets/images/logos/favicon.ico",
    shortcut: "/assets/images/logos/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
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
          <LanguageProvider lang={lang}>
            <DictionaryProvider dictionary={dictionary}>
              <Providers>
                {children}
              </Providers>
            </DictionaryProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}