'use client';

import { ContentLayout } from '@/layouts/ContentLayout';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Card, Theme, useMediaQuery } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';
import { ChatAppSidebar } from './ChatAppSidebar';

const useChatLayout = () => {
  const { category } = useParams();
  const { theme } = useJumboTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  return React.useMemo(
    () => ({
      sidebarOptions: {
        sx:
          md && Array.isArray(category) && category[1]
            ? { display: 'none' }
            : {
                display: 'flex',
                minWidth: 0,
                flexShrink: 0,
                flexDirection: 'column',
                width: 280,
                borderRight: 1,
                minHeight: '100%',
                borderRightColor: (theme: Theme) => theme.palette.divider,
                [theme.breakpoints.down('md')]: {
                  width: 'auto',
                  border: 'none',
                },
              },
      },
      wrapperOptions: {
        component: Card,
        sx: {
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        },
        container: true,
      },
      contentOptions: {
        sx: {
          p: { lg: 0, sm: 0, xs: 0 },
        },
      },
    }),
    [md, theme, category]
  );
};
export const ChatApp = ({ children }: { children: React.ReactNode }) => {
  const chatLayoutOptions = useChatLayout();
  return (
    <ContentLayout sidebar={<ChatAppSidebar />} {...chatLayoutOptions}>
      {children}
    </ContentLayout>
  );
};
