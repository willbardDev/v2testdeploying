'use client';

import React, { useEffect, useState } from 'react';
import styled from "@emotion/styled";
import { Avatar, Badge, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DashboardOutlined, Edit, Info, KeyboardArrowRightOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { Span } from '@jumbo/shared';
import { BackdropSpinner } from '@/shared/ProgressIndicators/BackdropSpinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import JumboChipsGroup from '@jumbo/components/JumboChipsGroup';
import { Organization } from '@/types/auth-types';
import { useBasicAuth } from '@/app/auth-providers/BasicAuth/BasicAuth';

interface OrganizationListItemProps {
  organization: Organization;
}

const Item = styled(Span)(({ theme }) => ({
  padding: theme.spacing(0, 1),
}));

export const OrganizationListItem: React.FC<OrganizationListItemProps> = ({ organization }) => {
  const router = useRouter();
  const { loadOrganization } = useBasicAuth();
  const { authOrganization, authUser, checkOrganizationPermission } = useJumboAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const isAuthOrganization = authOrganization?.organization?.id === organization.id;
  const roles = organization.roles || [];
  const rolesCount = roles.length;

  useEffect(() => {
    if (!authUser?.user) {
      router.push('/login');
    }
  }, [authUser, router]);

  const onLoad = async () => {
    setIsLoading(true);
    if (authOrganization?.organization?.id !== organization.id) {
      await loadOrganization(
        organization.id,
        (response) => {
          enqueueSnackbar(
            `${organization.name} is loaded to an active organization`,
            {
              variant: 'success'
            }
          );
        },
        (error: Error) => {
          enqueueSnackbar(
            `Something went wrong`,
            {
              variant: 'error'
            }
          );
        }
      );
      queryClient.clear();
      setIsLoading(false);
    }
    window.location.href = '/dashboard';
  };

  if (isLoading) {
    return <BackdropSpinner message="Loading organization..." />;
  }

  return (
    <Grid
      container
      sx={{
        borderTop: 1,
        borderColor: 'divider',
      }}
      spacing={1}
      my={1}
      paddingLeft={2.5}
    >
      <Grid size={{xs: 12, md: 6}}>
        <Stack direction={'row'} alignItems={'center'}>
          <Item>
            <Badge
              overlap="circular"
              variant="dot"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{
                '.MuiBadge-badge': {
                  border: '2px solid #FFF',
                  height: '14px',
                  width: '14px',
                  borderRadius: '50%',
                  bgcolor: isAuthOrganization ? "success.main" : "gray"
                }
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56
                }}
                alt={organization.name || 'Organization logo'}
                src={organization?.logo_path || '/assets/images/logo-symbol.png'}
              />
            </Badge>
          </Item>
          <Item>
            <Tooltip title={`Load ${organization.name}`}>
              <Typography 
                onClick={onLoad}
                sx={{ cursor: 'pointer' }} 
                variant={"h6"} 
                mb={0.5}
              >
                {organization.name || 'Unnamed Organization'}
              </Typography>
            </Tooltip>
            {organization.website && (
              <Typography variant={"body1"} color="text.secondary">
                {organization.website}
              </Typography>
            )}
          </Item>
        </Stack>
      </Grid>
      
      <Grid size={{xs: rolesCount > 2 ? 12 : 6, md: 6, lg: 3}}>
        <Typography variant={"h6"} mt={1} lineHeight={1.25}>
          Roles:
        </Typography>
        {roles.length > 0 ? (
          <JumboChipsGroup
            chips={roles}
            mapKeys={{ label: "name" }}
            spacing={1}
            size="small"
            max={3}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No roles assigned
          </Typography>
        )}
      </Grid>
      
      <Grid
        size={{xs: rolesCount > 2 ? 12 : 6, md: 12, lg: 3}}
        sx={{
          paddingRight: 2,
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'flex-end'
        }}
      >
        {isAuthOrganization && checkOrganizationPermission(PERMISSIONS.ORGANIZATION_UPDATE) && (
          <Link href={`/organizations/edit/${organization.id}`} passHref legacyBehavior>
            <IconButton component="a">
              <Tooltip title={`Edit ${organization.name}`} disableInteractive>
                <Edit />
              </Tooltip>
            </IconButton>
          </Link>
        )}
        
        {isAuthOrganization && checkOrganizationPermission(PERMISSIONS.ORGANIZATION_PROFILE) && (
          <IconButton onClick={() => router.push(`/organizations/profile/${organization.id}`)}>
            <Tooltip title={`${organization.name} Profile`} disableInteractive>
              <Info />
            </Tooltip>
          </IconButton>
        )}
        
        {isAuthOrganization ? (
          <Link href={'/dashboard'} passHref legacyBehavior>
            <IconButton component="a">
              <Tooltip title={`${organization.name} Dashboard`} disableInteractive>
                <DashboardOutlined />
              </Tooltip>
            </IconButton>
          </Link>
        ) : (
          <LoadingButton 
            sx={{ borderRadius: 100 }} 
            type='button' 
            loading={isLoading}
            onClick={onLoad}
          >
            <Tooltip title={`Load ${organization.name}`} disableInteractive>
              <KeyboardArrowRightOutlined />
            </Tooltip>
          </LoadingButton>
        )}
      </Grid>
    </Grid>
  );
};