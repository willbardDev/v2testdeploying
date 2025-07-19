import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import axios from '@/lib/services/config';

type FormValues = {
  email: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  email?: string;
};

const verifyUser = async (email: string) => {
  const res = await axios.post('/verify-user', { email });
  return res.data;
};

const UserManagementFormDialog: React.FC<Props> = ({ open, onClose, email }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (email) {
      reset({ email });
    } else {
      reset({ email: '' });
    }
  }, [email, reset, open]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => verifyUser(data.email),
    onSuccess: (res) => {
      enqueueSnackbar(res?.message || 'User verified successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || 'Verification failed', {
        variant: 'error',
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Verify User</DialogTitle>
      <DialogContent>
        <form id="verify-user-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="verify-user-form"
          variant="contained"
          color="primary"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? 'Verifying...' : 'Verify'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserManagementFormDialog;