import type { Metadata } from 'next';
import '@/styles/style.css';
import '@assets/fonts/noir-pro/styles.css';
import { ReactNode } from 'react';
import { Providers } from '../providers';
import { getDictionary } from './dictionaries';
import { DictionaryProvider } from './contexts/DictionaryContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Script from 'next/script';

// Determine if it's production on the server side
const isProduction = process.env.NODE_ENV === 'production';

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
  title: APP_NAME,
  description: APP_DESCRIPTION,
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'next14', 'pwa', 'next-pwa'],
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#2113AD' }],
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes',
  icons: [
    { rel: 'apple-touch-icon', url: '/assets/images/icons/logo-512.png' },
    { rel: 'icon', url: '/assets/images/icons/logo-512.png' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  other: {
    'msapplication-TileColor': '#6200EE',
    'theme-color': '#2113AD',
    keywords: 'Robust ERP, ProsERP, Accounts, Project Management, Inventory Management, Payroll, Requisitions',
  },
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} data-lt-installed="true">
      <head>
        <meta name="theme-color" content="#6200EE" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/images/icons/logo-512.png" />
        <link rel="apple-touch-icon" href="/assets/images/icons/logo-512.png" />
      </head>
      <body cz-shortcut-listen="true">
        <div id="root">
          <LanguageProvider lang={lang}>
            <DictionaryProvider dictionary={dictionary}>
              <Providers>{children}</Providers>
            </DictionaryProvider>
          </LanguageProvider>
        </div>
        {isProduction && (
          <Script strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  console.log('Attempting to register service worker...');
                  navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                      console.log('Service Worker registered:', registration);
                    },
                    (err) => {
                      console.error('Service Worker registration failed:', err);
                    }
                  );
                });
              }

              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                console.log('beforeinstallprompt triggered', e);
                // e.prompt(); // Uncomment for manual testing
              });
            `}
          </Script>
        )}
      </body>
    </html>
  );
}