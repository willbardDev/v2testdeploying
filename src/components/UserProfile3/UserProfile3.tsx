'use client';
import { ContentLayout } from '@/layouts/ContentLayout';
import { JumboCard } from '@jumbo/components';
import { Button, Container, IconButton } from '@mui/material';
import React from 'react';
import { RiAddLine } from 'react-icons/ri';
import { CONTAINER_MAX_WIDTH } from '../../config/layouts';
import { LicenseCertificate } from '../LicenseCertificate';
import { ProfileSkills } from '../ProfileSkills';
import { profileSkillsData } from '../ProfileSkills/data';
import { ProfileWorkHistory } from '../ProfileWorkHistory';
import { experiencesData } from '../ProfileWorkHistory/data';
import { Profile3Header } from './Profile3Header';
import { Profile3Sidebar } from './Profile3Sidebar';
import { UserAbout } from './UserAbout';

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
        sx: { flexDirection: { xs: 'column', lg: 'row' } },
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

export const UserProfile3 = () => {
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
      <ContentLayout
        rightSidebar={<Profile3Sidebar />}
        header={
          <>
            <Profile3Header />
            <UserAbout />
          </>
        }
        {...profileLayoutConfig}
      >
        {/** user profile skills */}
        <JumboCard
          title={'Profiles'}
          contentWrapper
          action={
            <Button size='small' startIcon={<RiAddLine />}>
              Add Skill Profile
            </Button>
          }
          sx={{ mb: 3.75 }}
          contentSx={{ pt: 0 }}
        >
          <ProfileSkills data={profileSkillsData} />
        </JumboCard>

        {/** Work History  */}
        <JumboCard
          title={'Work History'}
          contentWrapper
          action={
            <IconButton color='primary'>
              <RiAddLine />
            </IconButton>
          }
          sx={{
            mb: 3.75,
            '.MuiCardHeader-action': {
              my: -0.5,
              mr: -1,
            },
          }}
          contentSx={{ pt: 0 }}
        >
          <ProfileWorkHistory data={experiencesData} />
        </JumboCard>

        {/** Licence & Certificate Part */}
        <JumboCard
          title={'License & Certificates'}
          contentWrapper
          action={
            <IconButton color='primary'>
              <RiAddLine />
            </IconButton>
          }
          sx={{
            mb: 3.75,
            '.MuiCardHeader-action': {
              my: -0.5,
              mr: -1,
            },
          }}
          contentSx={{ pt: 0 }}
        >
          <LicenseCertificate />
        </JumboCard>
      </ContentLayout>
    </Container>
  );
};
