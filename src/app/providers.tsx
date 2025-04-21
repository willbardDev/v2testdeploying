'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { JumboConfigProvider, JumboDialog, JumboDialogProvider, JumboTheme } from '@jumbo/components';
import { CssBaseline } from '@mui/material';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import { AppSnackbar } from '@/components/AppSnackbar';
import { AuthInitializer } from '@/components/AuthInitializer/AuthInitializer';
import { Suspense } from 'react';
import { Spinner } from '@/components/Spinner';
import { CONFIG } from '@/config';
import { JumboAuthProvider } from './providers/JumboAuthProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Optional: customize React Query defaults
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  return (
    <SessionProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <JumboAuthProvider>
            <AppRouterCacheProvider>
              <JumboConfigProvider LinkComponent={Link}>
                <JumboTheme init={CONFIG.THEME}>
                  <CssBaseline />
                  <JumboDialogProvider>
                    <AuthInitializer>
                      <JumboDialog />
                      <AppSnackbar>
                        <Suspense fallback={<Spinner />}>
                          {children}
                        </Suspense>
                      </AppSnackbar>
                    </AuthInitializer>
                  </JumboDialogProvider>
                </JumboTheme>
              </JumboConfigProvider>
            </AppRouterCacheProvider>
          </JumboAuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}