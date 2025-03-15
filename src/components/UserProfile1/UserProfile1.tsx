'use client';
import { ContentLayout } from '@/layouts/ContentLayout';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { alpha, Stack } from '@mui/material';
import React from 'react';
import { Events } from '../Events';
import { About } from './About';
import { Biography } from './Biography';
import { ProfileHeader } from './ProfileHeader';
import { UserProfileSidebar } from './UserProfileSidebar';

const useProfileLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      headerOptions: {
        sx: {
          mt: -4,
          mb: -7.25,
          mx: { xs: -4, lg: -6 },
          p: { xs: theme.spacing(6, 4, 11), lg: theme.spacing(6, 6, 11) },
          background: `#002447 url(${getAssetPath(`${ASSET_IMAGES}/profile-bg.jpg`, '1920x580')}) no-repeat center`,
          backgroundSize: 'cover',
          color: 'common.white',
          position: 'relative',

          '&::after': {
            display: 'inline-block',
            position: 'absolute',
            content: `''`,
            inset: 0,
            backgroundColor: alpha(theme.palette.common.black, 0.65),
          },
        },
      },
      sidebarOptions: {
        sx: {
          mr: 3.75,
          width: { xs: '100%', lg: '33%' },
          [theme.breakpoints.down('lg')]: {
            minHeight: 0,
            mr: 0,
            order: 2,
            mt: 3.75,
          },
        },
      },
      wrapperOptions: {
        sx: {
          [theme.breakpoints.down('lg')]: {
            flexDirection: 'column',
          },
        },
        container: true,
      },
      mainOptions: {
        sx: {
          [theme.breakpoints.down('lg')]: {
            minHeight: 0,
          },
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, sm: 0, xs: 0 },
        },
      },
    }),
    [theme]
  );
};
export const UserProfile1 = () => {
  const profileLayoutOptions = useProfileLayout();
  return (
    <ContentLayout
      header={<ProfileHeader />}
      sidebar={<UserProfileSidebar />}
      {...profileLayoutOptions}
    >
      <Stack spacing={3.75}>
        <About />
        <Biography />
        <Events />
      </Stack>
    </ContentLayout>
  );
};
