import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified'; // You can change this if you want to use a custom icon
import VerifyUserDialog from './UserManagementFormDialog';

const UserManagementActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Tooltip title="Verify User">
        <IconButton onClick={() => setOpenDialog(true)} color="primary">
          <VerifiedIcon />
        </IconButton>
      </Tooltip>

      <VerifyUserDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
};

export default UserManagementActionTail;
