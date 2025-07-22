import React from 'react';
import {
  Divider,
  Grid,
  Tooltip,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import UserManagementListItemActions from './UserManagementListItemAction';
import { User } from './UserManagementType';

type Props = {
  user: User;
  onUserUpdated?: () => void;
  actionTail?: React.ReactNode;
};

const UserManagementListItem = ({ user, onUserUpdated, actionTail }: Props) => {
  return (
    <>
      <Divider />
      <Grid
        container
        spacing={1}
        alignItems="center"
        columnSpacing={2}
        px={2}
        py={1}
        paddingRight={3}
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        {/* User Name Only */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Tooltip title="User Name">
            <Typography variant="subtitle1" noWrap>
              {user.name}
            </Typography>
          </Tooltip>
        </Grid>

      {/* Email & Phone stacked vertically, left-aligned */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {/* Email */}
          <Tooltip title="Email">
            <Box display="flex" alignItems="center" gap={0.5}>
              <EmailIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Tooltip>

          {/* Phone */}
          <Tooltip title="Phone Number">
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <PhoneIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {(user as any).phone || 'N/A'}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Grid>



        {/* Organization Badges */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack direction="row" spacing={0.5} rowGap={0.5} flexWrap="wrap">
            {(user.organizations || []).map((org) => (
              <Tooltip key={org.id} title={org.name}>
                <Chip
                  label={org.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: 1.5,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        </Grid>

        {/* Account Status */}
         <Grid size={{ xs: 4, md: 2 }} container justifyContent="flex-end">
          <Tooltip title="Account Status">
            <Chip
              size="small"
              label={user.is_active ? 'Active' : 'Inactive'}
              sx={{
                fontWeight: 500,
                backgroundColor: user.is_active ? 'success.main' : 'error.main',
                color: 'white',
                fontSize: '0.8125rem',
                borderColor: 'transparent',
                textTransform: 'lowercase',
                '&:hover': {
                  backgroundColor: user.is_active ? 'success.dark' : 'error.dark',
                },
              }}
            />
          </Tooltip>
        </Grid>

        {/* Actions */}
        <Grid size={{ xs: 12, md: 2 }} textAlign="end">
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
