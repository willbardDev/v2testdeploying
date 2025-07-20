import React, { useState } from 'react';
import {
  ButtonGroup,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import VerifyUserFormDialog from './VerifyUserFormDialog';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementServices from './user-management-services';
import { AxiosError } from 'axios';
import { UserManager } from './UserManagementType';

interface VerifyUserPayload {
  email: string;
}

interface VerifyUserResponse {
  message: string;
}

interface ApiErrorResponse {
  message?: string;
}

const UserManagementActionTail = ({ user }: { user: UserManager }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { theme } = useJumboTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { checkOrganizationPermission } = useJumboAuth();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const queryClient = useQueryClient();

  const { mutate: verifyUser } = useMutation<VerifyUserResponse, AxiosError<ApiErrorResponse>, VerifyUserPayload>({
    mutationFn: userManagementServices.verify,
    onSuccess: (data) => {
      enqueueSnackbar(data?.message || 'User verified successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(false);
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Verification failed';
      enqueueSnackbar(message, { variant: 'error' });
    }
  });

  const handleSubmitVerification = (data: VerifyUserPayload) => {
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

      <VerifyUserFormDialog
        user={user}
        open={openDialog}
        setOpenDialog={setOpenDialog}
        onSubmit={handleSubmitVerification}
      />
    </>
  );
};

export default UserManagementActionTail;
