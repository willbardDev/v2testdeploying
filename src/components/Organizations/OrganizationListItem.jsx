'use client';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { Dashboard, Edit, Info } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

const OrganizationListItem = ({ organization }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { authData } = useJumboAuth();

  const isCurrentOrganization = authData?.authOrganization?.organization?.id === organization.id;

  const handleLoadOrganization = async () => {
    setIsLoading(true);
    try {
      // Replace with actual logic
      // await loadOrganization(organization.id);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to load organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {isLoading && <LinearProgress sx={{ mb: 1 }} />}

      <Grid
        container
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          py: 2,
          px: 2,
          alignItems: 'center'
        }}
      >
        <Grid item xs={12} md={6}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Badge
              overlap="circular"
              variant="dot"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  border: '2px solid #FFF',
                  height: 14,
                  width: 14,
                  borderRadius: '50%',
                  bgcolor: isCurrentOrganization ? 'success.main' : 'grey.500'
                }
              }}
            >
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={organization.name}
                src={organization.logo_path || '/assets/images/logo-symbol.png'}
              />
            </Badge>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={handleLoadOrganization}
              >
                {organization.name}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3} sx={{ mt: { xs: 2, md: 0 } }}>
          <Typography variant="subtitle2" gutterBottom>
            Roles:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {organization.roles?.slice(0, 3).map(role => (
              <Chip key={role.id} label={role.name} size="small" variant="outlined" />
            ))}
            {organization.roles?.length > 3 && (
              <Chip
                label={`+${organization.roles.length - 3}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: { xs: 2, md: 0 }
          }}
        >
          {isCurrentOrganization && (
            <>
              <Tooltip title="Edit organization">
                <IconButton component={Link} href={`/organizations/edit/${organization.id}`}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Organization profile">
                <IconButton
                  onClick={() =>
                    router.push(`/organizations/profile/${organization.id}`)
                  }
                >
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Go to dashboard">
                <IconButton component={Link} href="/dashboard">
                  <Dashboard fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationListItem;
