'use client';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { ContentLayout } from '@/layouts/ContentLayout';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Container, Stack, useMediaQuery } from '@mui/material';
import React from 'react';
import { PageHeader } from '../PageHeader';
import { ContactFab } from './ContactFab';
import { ContactsAppSidebar } from './ContactsAppSidebar';
import { FolderDropdown } from './FolderDropdown';
import { LabelDropdown } from './LabelDropdown';
import { useContactLayout } from './useContactLayout';

export const ContactApp = ({ children }: { children: React.ReactNode }) => {
  const contactLayoutConfig = useContactLayout();
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
            title={'Contacts'}
            subheader={'A ready to integrate ui to build a contacts module.'}
          />
        }
        sidebar={<ContactsAppSidebar />}
        {...contactLayoutConfig}
      >
        {lg && (
          <Stack spacing={2} direction={'row'} sx={{ mb: 3, mt: -2 }}>
            <FolderDropdown />
            <LabelDropdown />
            <ContactFab />
          </Stack>
        )}
        {children}
      </ContentLayout>
    </Container>
  );
};
