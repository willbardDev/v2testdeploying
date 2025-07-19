// UserManagementActionTail.tsx
import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import VerifyUserDialog from './UserManagementFormDialog';
import { UserManager } from './UserManagementType';

type Props = {
  user: UserManager;
};

const UserManagementActionTail = ({ user }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Tooltip title="Verify User">
        <IconButton onClick={() => setOpenDialog(true)} color="primary">
          <VerifiedIcon />
        </IconButton>
      </Tooltip>

      <VerifyUserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        email={user.email}
      />
    </>
  );
};

export default UserManagementActionTail;
