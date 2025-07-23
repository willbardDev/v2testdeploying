import React from 'react';
import {
  Divider,
  Grid,
  Tooltip,
  Typography,
  Box,
  Stack,
  Avatar,
  Badge,
} from '@mui/material';
import UserManagementListItemActions from './UserManagementListItemAction';
import { User } from './UserManagementType';

type Props = {
  user: User;
  onUserUpdated?: () => void;
  actionTail?: React.ReactNode;
};

const UserManagementListItem = ({ user, onUserUpdated, actionTail }: Props) => {
  const isActive = user.status === 'active';

  return (
    <>
      <Divider />
      <Grid
        container
        spacing={2}
        alignItems="center"
        px={2}
        py={1}
        paddingRight={3}
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        {/* User Name */}
        <Grid size={{ xs: 12, md: 2}} sx={{ mb: 1.5 }} >
          <Tooltip title="User Name">
            <Typography variant="subtitle1" noWrap>
              {user.name}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Email & Phone */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ mt: 1 }}>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Tooltip title="Email">
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Tooltip>

            <Tooltip title="Phone Number">
              <Typography variant="body2" color="text.secondary" noWrap mt={0.5}>
                {(user as any).phone || 'N/A'}
              </Typography>
            </Tooltip>
          </Box>
        </Grid>

   {/* Organizations with logo only */}
<Grid size={{ xs: 12, md: 3 }}container justifyContent="flex-end">
  <Stack direction="row" spacing={1} rowGap={0.5} flexWrap="wrap">
    {(user.organizations || []).map((org) => (
      org.logo_path && (
        <Tooltip key={org.id} title={org.name}>
          <Avatar
            src={org.logo_path}
            alt={org.name}
            sx={{ width: 28, height: 28 }}
          />
        </Tooltip>
      )
    ))}
  </Stack>
</Grid>


       {/* Status Badge */}
<Grid size={{ xs: 6, md: 2}} container justifyContent="flex-end">
  <Tooltip title="Account Status">
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: isActive ? '#00C853' : 'error.main', // Custom vibrant green
        color: '#fff',
        borderRadius: '999px',
        textTransform: 'lowercase',
        minWidth: 60,
        textAlign: 'center',
        display: 'inline-block',
        lineHeight: 1.4,
      }}
    >
      {isActive ? 'active' : 'inactive'}
    </Box>
  </Tooltip>
</Grid>


        {/* Actions */}
        <Grid size={{ xs: 12, md: 2}}textAlign="end">
          <UserManagementListItemActions
            user={user}
            onUserUpdated={onUserUpdated}
          />
          {actionTail}
        </Grid>
      </Grid>
    </>
  );
};

export default UserManagementListItem;
