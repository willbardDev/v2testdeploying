import React, { useState } from 'react';
import {
  ButtonGroup,
  Dialog,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import UserManagementFormDialog from './UserManagementFormDialog';

const UserManagementActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { checkOrganizationPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleSubmitVerification = (data: { reason: string }) => {
    // Handle the verification logic here
    console.log('Verification data:', data);
    // You would typically make an API call here to verify the user
  };

  return (
    <>
      <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
        {checkOrganizationPermission(PERMISSIONS.USERS_MANAGE) && (
          <Tooltip title="Verify User">
            <IconButton onClick={() => setOpenDialog(true)}>
              <VerifiedIcon />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>

      <UserManagementFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmitVerification}
        // You can optionally pass userName if available
        // userName="John Doe"
      />
    </>
  );
};

export default UserManagementActionTail;