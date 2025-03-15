'use client';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { ContentLayout } from '@/layouts/ContentLayout';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Container, Stack, useMediaQuery } from '@mui/material';
import React from 'react';
import { PageHeader } from '../PageHeader';
import { FilterDropdown } from './FilterDropdown';
import { FolderDropdown } from './FolderDropdown';
import { LabelDropdown } from './LabelDropdown';
import { MailAppSidebar } from './MailAppSidebar';
import { MailFab } from './MailFab';
import { useMailLayout } from './useMailLayout';
export const MailApp = ({ children }: { children: React.ReactNode }) => {
  const mailLayoutConfig = useMailLayout();
  const { theme } = useJumboTheme();
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <ContentLayout
        header={
          <PageHeader
            title={'Mail App'}
            subheader={'A ready to integrate ui to build a mails module.'}
          />
        }
        sidebar={<MailAppSidebar />}
        {...mailLayoutConfig}
      >
        {lg && (
          <Stack spacing={2} direction={'row'} sx={{ mb: 3, mt: -2 }}>
            <FolderDropdown />
            <FilterDropdown />
            <LabelDropdown />
            <MailFab />
          </Stack>
        )}
        {children}
      </ContentLayout>
    </Container>
  );
};
