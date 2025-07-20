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
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementServices from './user-management-services';

interface VerifyUserFormDialogProps {
  open: boolean;
  onClose: () => void; 
  onSubmit: (data: FormData) => void;
}

interface FormData {
  email: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
});

const VerifyUserFormDialog: React.FC<VerifyUserFormDialogProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const { mutate: verifyUser, isPending } = useMutation<
    { message: string },
    unknown,
    { email: string }
  >({
    mutationFn: userManagementServices.verify, 
    onSuccess: (data) => {
      enqueueSnackbar(data.message || 'User verified', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      (onClose);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error.message || 'Verification failed';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const onSubmit = (data: FormData) => {
    verifyUser({ email: data.email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle sx={{ textAlign: 'center' }}>Verify User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Email"
              size="small"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => (onClose)} size="small">
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          size="small"
          loading={isPending}
        >
          Verify
        </LoadingButton>
      </DialogActions>
    </form>
  );
};

export default VerifyUserFormDialog;
