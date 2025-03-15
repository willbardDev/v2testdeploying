'use client';
import { AppPagination1 } from '@/components/AppPagination1';
import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { JumboCard, JumboDdMenu } from '@jumbo/components';
import { Div, Span } from '@jumbo/shared';
import { JumboForm, JumboInput } from '@jumbo/vendors/react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Chip, Stack, Typography, alpha } from '@mui/material';
import Image from 'next/image';
import { SettingHeader } from '../SettingHeader';
import { teamMembers } from './data';
import { TeamMembersFilter } from './TeamMembersFilter';
import { TeamMembersList } from './TeamMembersList';

const TeamSettings = () => {
  return (
    <>
      <SettingHeader
        title={'Team'}
        action={
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Button
              variant='contained'
              sx={{ boxShadow: 'none', textTransform: 'none' }}
            >
              Invite Members
            </Button>
            <Button
              endIcon={
                <Chip
                  label={3}
                  size='small'
                  sx={{
                    '.MuiChip-label': {
                      fontSize: 12,
                    },
                  }}
                  variant='outlined'
                />
              }
              variant='outlined'
              sx={{
                textTransform: 'none',
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            >
              Approve Requests
            </Button>
            <JumboDdMenu />
          </Stack>
        }
        divider
        sx={{ mb: 3 }}
      />
      <JumboCard
        sx={{
          background: (theme) => alpha(theme.palette.primary.main, 0.25),
          boxShadow: 'none',
          mb: 4,
          p: 1,
        }}
      >
        <Div
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minWidth: 0,
          }}
        >
          <Div sx={{ width: 300, p: 3 }}>
            <Typography variant='h3' fontWeight={300} fontSize={32} mb={2}>
              There is a team behind every success!
            </Typography>
            <Image
              width={218}
              height={116}
              src={`${ASSET_IMAGES}/team.png`}
              alt='Team'
              style={{ maxWidth: '100%', verticalAlign: 'middle' }}
            />
          </Div>
          <Div
            sx={{
              flex: 1,
              backgroundColor: (theme) => theme.palette.background.paper,
              borderRadius: 2.5,
              p: 3,
            }}
          >
            <Typography variant='h3' mb={2.5}>
              Add your team and start creating great things together
            </Typography>
            <JumboForm onChange={() => {}}>
              <Div
                sx={{
                  '& .MuiTextField-root': {
                    mb: 2,
                  },
                }}
              >
                <JumboInput
                  fieldName='email'
                  placeholder='Email'
                  size='small'
                  fullWidth
                />
                <JumboInput
                  fieldName='email2'
                  placeholder='Email'
                  size='small'
                  fullWidth
                />
                <JumboInput
                  fieldName='email3'
                  placeholder='Email'
                  size='small'
                  fullWidth
                />
                <Stack direction={'row'} spacing={2}>
                  <LoadingButton variant='contained' sx={{ boxShadow: 'none' }}>
                    Send Invites
                  </LoadingButton>{' '}
                  <LoadingButton
                    variant='contained'
                    color='inherit'
                    sx={{ boxShadow: 'none' }}
                  >
                    Dismiss
                  </LoadingButton>
                </Stack>
              </Div>
            </JumboForm>
          </Div>
        </Div>
      </JumboCard>

      <TeamMembersFilter />
      <Card sx={{ mb: 3 }}>
        <TeamMembersList />
      </Card>
      <Stack direction={'row'} justifyContent={'space-between'} sx={{ mx: 2 }}>
        <Typography variant='body1' sx={{ color: 'text.secondary' }}>
          Showing <Span sx={{ color: 'text.primary' }}>1</Span> of{' '}
          <Span sx={{ color: 'text.primary' }}>{teamMembers?.length}</Span>
        </Typography>
        <AppPagination1 data={teamMembers} />
      </Stack>
    </>
  );
};

export { TeamSettings };
