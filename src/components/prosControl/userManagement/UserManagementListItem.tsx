import React from 'react';
import { 
  Divider, 
  Grid, 
  Tooltip, 
  Typography,
  Avatar,
  Chip,
  Box
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';
import { UserManager } from './UserManagementType';
import UserManagementListItemActions from './UserManagementListItemAction';

type Props = {
  user: UserManager;
  onUserUpdated?: () => void;
};

const UserManagementListItem = ({ user, onUserUpdated }: Props) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <Divider />
      <Grid
        container
        alignItems="center"
        columnSpacing={2}
        paddingLeft={2}
        paddingRight={2}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          py: 2
        }}
      >
        {/* Avatar and Name */}
        <Grid size={{xs: 12, md: 3}}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                bgcolor: user.is_active ? 'primary.main' : 'grey.500',
                width: 40,
                height: 40
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Tooltip title="User Name">
                  <Typography variant="subtitle1" fontWeight="medium" noWrap>
                    {user.name}
                  </Typography>
                </Tooltip>
                {user.is_verified && (
                  <VerifiedIcon 
                    fontSize="small" 
                    color="success" 
                    sx={{ fontSize: '1rem' }} 
                  />
                )}
              </Box>
              <Tooltip title="Email">
                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Grid>

        {/* Status Chips */}
        <Grid size={{xs: 12, md: 5}}>
          <Box display="flex" gap={1}>
            <Tooltip title="Verification Status">
              <Chip
                size="small"
                label={user.is_verified ? 'Verified' : 'Unverified'}
                color={user.is_verified ? 'success' : 'default'}
                variant="outlined"
                sx={{ borderRadius: 1, fontWeight: 500 }}
              />
            </Tooltip>
            <Tooltip title="Account Status">
              <Chip
                size="small"
                label={user.is_active ? 'Active' : 'Inactive'}
                color={user.is_active ? 'primary' : 'warning'}
                variant="outlined"
                sx={{ borderRadius: 1, fontWeight: 500 }}
              />
            </Tooltip>
          </Box>
        </Grid>

        {/* Actions */}
        <Grid size={{xs: 12, md: 4}}textAlign="end">
          <UserManagementListItemActions 
            user={user} 
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UserManagementListItem;