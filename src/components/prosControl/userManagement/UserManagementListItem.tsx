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
      sx={{
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      {/* 1. User Name */}
      <Grid size={{xs: 12, md: 3}}>
        <Tooltip title="User Name">
          <Typography variant="subtitle1" noWrap sx={{ fontSize: '0.85rem' }}>
          {user.name}
        </Typography>

        </Tooltip>
      </Grid>

      {/* 2. Email + Phone */}
      <Grid size={{xs: 12, md: 3}}>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Tooltip title="Email">
  <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
    {user.email}
  </Typography>
</Tooltip>

<Tooltip title="Phone Number">
  <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
    {(user as any).phone || 'N/A'}
  </Typography>
</Tooltip>

        </Box>
      </Grid>

      {/* 3. Organizations (Logo only) */}
      <Grid size={{ xs: 12, md: 2 }} container justifyContent="flex-end">
  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
    {(user.organizations || []).map((org) =>
      org.logo_path && (
        <Tooltip key={org.id} title={org.name}>
          <Avatar
            src={org.logo_path}
            alt={org.name}
            sx={{ width: 32, height: 32 }}
          />
        </Tooltip>
      )
    )}
  </Stack>
</Grid>


  {/* 4. Status Badge */}
<Grid size={{ xs: 4, md: 3 }}>
  <Box display="flex" justifyContent="flex-end">
    <Tooltip title="Account Status">
      <Box
        sx={{
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: isActive ? '#00C853' : 'error.main',
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
  </Box>
</Grid>

{/* 5. Actions */}
<Grid size={{ xs: 12, md: 1 }} container justifyContent="flex-end">
  <UserManagementListItemActions
    user={user}
    onUserUpdated={onUserUpdated}
  />
  {actionTail}
</Grid>

    </Grid>
  </>
);
}

export default UserManagementListItem;
