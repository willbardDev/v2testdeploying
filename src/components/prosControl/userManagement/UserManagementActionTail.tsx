import React, { useState } from 'react';
import {
  ButtonGroup,
  IconButton,
  Tooltip,
  useMediaQuery,
  Dialog
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import VerifyUserFormDialog from './VerifyUserFormDialog';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementServices from './user-management-services';

const UserManagementActionTail = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { checkOrganizationPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const queryClient = useQueryClient();

  const { mutate: verifyUser } = useMutation({
    mutationFn: userManagementServices.verify,
    onSuccess: (data) => {
      enqueueSnackbar(data?.message || 'User verified successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(false);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || 'Verification failed';
      enqueueSnackbar(message, { variant: 'error' });
    }
  });

  const handleSubmitVerification = (data: { email: string }) => {
    verifyUser(data);
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

      {/* ✅ FIXED: proper usage of Dialog */}
      <Dialog
        maxWidth="sm"
        fullWidth
        fullScreen={belowLargeScreen}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <VerifyUserFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleSubmitVerification}
        />
      </Dialog>
    </>
  );
};

export default UserManagementActionTail;
