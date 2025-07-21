import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserManager } from './UserManagementType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import userManagementServices from './user-management-services';
import { AxiosError } from 'axios';

interface VerifyUserPayload {
  email: string;
}

interface VerifyUserResponse {
  message: string;
}

interface ApiErrorResponse {
  message?: string;
}


type VerifyUserFormDialogProps = {
  user: UserManager;
  open: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onUserUpdated?: () => void;
  onClose?: () => void;
  onSubmit?: (data: { email: string }) => void;
};

const validationSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
});

const VerifyUserFormDialog: React.FC<VerifyUserFormDialogProps> = ({
  user,
  open,
  setOpenDialog,
  onClose = () => setOpenDialog(false),
  onSubmit = () => {},
}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ email: string }>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });
 
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
  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: { email: string }) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle sx={{ textAlign: 'center' }}>Verify User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                size="small"
                {...register('email')}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                autoFocus
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="small" disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" size="small" loading={isSubmitting}>
            Verify
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VerifyUserFormDialog;
