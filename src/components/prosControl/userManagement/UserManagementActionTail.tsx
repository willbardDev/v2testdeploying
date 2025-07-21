import React, { useState } from 'react';
import {
  ButtonGroup,
  IconButton,
  Tooltip,
  useMediaQuery,
  Dialog
} from '@mui/material';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import VerifyUserFormDialog from './VerifyUserFormDialog';

const UserManagementActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { checkOrganizationPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
 
  return (
    <React.Fragment>
     <Dialog maxWidth="md" fullScreen={belowLargeScreen} open={openDialog}>
      <VerifyUserFormDialog setOpenDialog={setOpenDialog}/>
    </Dialog>
      <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
        {checkOrganizationPermission(PERMISSIONS.USERS_MANAGE) && (
          <Tooltip title="Verify User">
            <IconButton onClick={() => setOpenDialog(true)}>
              <VerifiedOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </React.Fragment>
  );
};

export default UserManagementActionTail;
