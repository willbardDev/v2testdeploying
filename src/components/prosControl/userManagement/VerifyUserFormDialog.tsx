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
  onSubmit: (data: { email: string }) => void;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
});

const VerifyUserFormDialog: React.FC<VerifyUserFormDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ email: string }>({
    resolver: yupResolver(validationSchema),
  });

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
          <Button 
            onClick={handleClose} 
            size="small"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isSubmitting}
          >
            Verify
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VerifyUserFormDialog;