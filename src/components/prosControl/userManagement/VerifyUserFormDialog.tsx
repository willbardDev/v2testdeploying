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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import userManagementServices from './user-management-services';
import { AxiosError } from 'axios';
import { User } from './UserManagementType';

    interface VerifyUserFormValues {
      email: string;
    }

    interface VerifyUserResponse {
      message: string;
    }

    interface ApiErrorResponse {
      message?: string;
    }

    type VerifyUserFormDialogProps = {
      open: boolean;
      setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
      user?: User;
    };

    const validationSchema = yup.object({
      email: yup.string().required('Email is required').email('Enter a valid email'),
    });

    const VerifyUserFormDialog: React.FC<VerifyUserFormDialogProps> = ({
      open,
      user,
      setOpenDialog,
    }) => {
      const queryClient = useQueryClient();
      const { enqueueSnackbar } = useSnackbar();

      const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
      } = useForm<VerifyUserFormValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
          email: '',
        },
      });

    useEffect(() => {
      if (user?.email) {
        setValue('email', user.email);
      }
    }, [user, setValue]);

    const { mutate: verifyUser, isPending: isVerifying } = useMutation<
      VerifyUserResponse,
      AxiosError<ApiErrorResponse>,
      VerifyUserFormValues
    >({
      mutationFn: (data) => userManagementServices.verify(data),
      onSuccess: (data) => {
        enqueueSnackbar(data.message || 'User verified successfully', {
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        handleClose();
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || error.message || 'Verification failed';
        enqueueSnackbar(message, { variant: 'error' });
      },
    });

    const handleClose = () => {
      reset();
      setOpenDialog(false);
    };

    const onSubmit = (data: VerifyUserFormValues) => {
      verifyUser(data);
    };

    return (
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogTitle sx={{ textAlign: 'center' }}>
            Verify User {user?.name}
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email"
                  size="small"
                  {...register('email')}
                  error={!!errors.email}
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
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <LoadingButton 
              type="submit" 
              variant="contained" 
              size="small" 
              loading={isVerifying}
            >
              Verify
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

export default VerifyUserFormDialog;