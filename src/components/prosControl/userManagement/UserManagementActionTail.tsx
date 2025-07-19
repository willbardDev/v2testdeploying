import { MailOutlined } from '@mui/icons-material';
import {
  ButtonGroup,
  Dialog,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import React, { useState } from 'react';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PROS_CONTROL_PERMISSIONS } from '@/utilities/constants/prosControlPermissions'; 
import UserManagementFormDialog from './UserManagementFormDialog';

const UserManagementActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { checkPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <Dialog maxWidth="sm" fullScreen={belowLargeScreen} open={openDialog}>
        <UserManagementFormDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
      </Dialog>

      <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
        {checkPermission(PROS_CONTROL_PERMISSIONS.USERS_MANAGE) && (
          <Tooltip title="Verify User Email">
            <IconButton onClick={() => setOpenDialog(true)}>
              <MailOutlined />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup> 
    </>
  );
};

export default UserManagementActionTail;