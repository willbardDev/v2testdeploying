'use client';
import { ContentLayout } from '@/layouts/ContentLayout';
import { JumboCard, JumboDdMenu } from '@jumbo/components';
import { Container } from '@mui/material';
import React from 'react';
import { CONTAINER_MAX_WIDTH } from '../../config/layouts';
import { LicenseCertificate } from '../LicenseCertificate';
import { ProfileWorkHistory } from '../ProfileWorkHistory';
import { experiencesData } from '../ProfileWorkHistory/data';
import { About } from './About';
import { BasicInformation } from './BasicInformation';
import { Profile2Header } from './Profile2Header';
import { Profile2Sidebar } from './Profile2Sidebar';
import { Profile2Skill } from './Profile2Skill';

const useProfileLayout = () => {
  return React.useMemo(
    () => ({
      rightSidebarOptions: {
        sx: {
          display: 'flex',
          flexShrink: 0,
          flexDirection: 'column',
          width: { md: 'auto', lg: 350 },
        },
      },
      wrapperOptions: {
        sx: {
          flexDirection: { xs: 'column', lg: 'row' },
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, sm: 0, xs: 0 },
          mr: { lg: 3 },
        },
      },
      mainOptions: {
        sx: {
          minHeight: 0,
        },
      },
    }),
    []
  );
};
export const UserProfile2 = () => {
  const profileLayoutConfig = useProfileLayout();
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
      {/** Content Part */}
      <ContentLayout
        rightSidebar={<Profile2Sidebar />}
        header={
          <>
            <Profile2Header />
            <BasicInformation />
          </>
        }
        {...profileLayoutConfig}
      >
        <JumboCard
          title={'About'}
          subheader={'Education, Work and More'}
          action={<JumboDdMenu />}
          contentWrapper
          contentSx={{ pt: 0 }}
          sx={{ mb: 3.75 }}
        >
          <About />
        </JumboCard>
        {/** Profile Work History Component */}
        <JumboCard
          title={'Experience'}
          subheader={'Your work experience and achievements'}
          action={<JumboDdMenu />}
          contentWrapper
          contentSx={{ pt: 0 }}
          sx={{ mb: 3.75 }}
        >
          <ProfileWorkHistory data={experiencesData} />
        </JumboCard>

        <JumboCard
          title={'Skill'}
          action={<JumboDdMenu />}
          contentWrapper
          contentSx={{ pt: 0 }}
          sx={{ mb: 3.75 }}
        >
          <Profile2Skill />
        </JumboCard>

        {/** License & Certificate */}
        <JumboCard
          title={'License & Certificates'}
          subheader={'Your work experience and achievements'}
          action={<JumboDdMenu />}
          contentWrapper
          contentSx={{ pt: 0 }}
          sx={{ mb: 3.75 }}
        >
          <LicenseCertificate />
        </JumboCard>
      </ContentLayout>
    </Container>
  );
};
