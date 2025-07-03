import { AddOutlined } from '@mui/icons-material';
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
import { PERMISSIONS } from '@/utilities/constants/permissions'; 
import OutletFormDialog from './OutletFormDialog';

c

const OutletActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { checkOrganizationPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

 return (
    <React.Fragment>
      <Dialog maxWidth="md" fullScreen={belowLargeScreen} open={openDialog}>
        <OutletFormDialog setOpenDialog={setOpenDialog} />
      </Dialog>
      <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
        {checkOrganizationPermission(PERMISSIONS.USERS_INVITE) && (
          <Tooltip title={'New Outlet'}>
            <IconButton onClick={() => setOpenDialog(true)}>
              <AddOutlined />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </React.Fragment>
  );
};

export default OutletActionTail;
