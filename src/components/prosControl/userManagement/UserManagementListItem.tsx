import React from 'react';
import {
  Card,
  Stack,
  Typography,
  Chip,
  Avatar,
  Box,
  useTheme
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { UserManager } from './UserManagementType';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import EmailIcon from '@mui/icons-material/Email';
import UserManagementListItemActions from './UserManagementListItemAction';

type Props = {
  user: UserManager;
  onUserUpdated?: () => void; // Optional callback for parent component
};

const UserManagementListItem: React.FC<Props> = ({ user, onUserUpdated }) => {
  const { checkPermission } = useJumboAuth();
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card 
      sx={{ 
        p: 2, 
        mb: 2,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: user.is_active ? theme.palette.primary.main : theme.palette.grey[500],
              width: 48,
              height: 48
            }}
          >
            {getInitials(user.name)}
          </Avatar>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight="medium">
                {user.name}
              </Typography>
              {user.is_verified && (
                <VerifiedIcon 
                  fontSize="small" 
                  color="success" 
                  sx={{ 
                    verticalAlign: 'middle',
                    fontSize: '1rem'
                  }} 
                />
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
              <EmailIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} mt={1.5}>
              <Chip
                size="small"
                label={user.is_verified ? 'Verified' : 'Unverified'}
                color={user.is_verified ? 'success' : 'default'}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  fontWeight: 500 
                }}
              />
              <Chip
                size="small"
                label={user.is_active ? 'Active' : 'Inactive'}
                color={user.is_active ? 'primary' : 'warning'}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  fontWeight: 500 
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Box>
          <UserManagementListItemActions 
            user={user} 
          />
        </Box>
      </Stack>
    </Card>
  );
};

export default UserManagementListItem;