import React, { useState } from 'react';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { AddOutlined } from '@mui/icons-material';
import { ButtonGroup, Tooltip, IconButton, Dialog, useMediaQuery} from '@mui/material';
import StoreForm from '../../procurement/stores/StoreForm';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useJumboTheme } from '@jumbo/hooks';

const StoreActionTail = () => {
  const { checkOrganizationPermission } = useJumboAuth();
  const [openDialog, setOpenDialog] = useState(false);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <React.Fragment>
      <Dialog maxWidth="xs" fullScreen={belowLargeScreen} open={openDialog}>
        <StoreForm setOpenDialog={setOpenDialog} />
      </Dialog>
      <ButtonGroup variant="outlined" size="small" disableElevation sx={{ '& .MuiButton-root': { px: 1 } }}>
        {checkOrganizationPermission(PERMISSIONS.USERS_INVITE) && (
          <Tooltip title={"New Store"}>
            <IconButton onClick={() => setOpenDialog(true)}>
              <AddOutlined />
            </IconButton>
          </Tooltip>
        )}
      </ButtonGroup>
    </React.Fragment>
  );
};

export default StoreActionTail;