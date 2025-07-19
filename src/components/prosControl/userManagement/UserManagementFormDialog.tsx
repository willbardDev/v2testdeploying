'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type FormData = {
  reason: string;
};

const schema = yup.object({
  reason: yup.string().required('Verification reason is required'),
});

type Props = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FormData) => void;
  userName?: string;
};

const UserManagementFormDialog: React.FC<Props> = ({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  userName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Verify User</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          Are you sure you want to verify <strong>{userName || 'this user'}</strong>?
        </Typography>

        <textarea
          {...register('reason')}
          placeholder="Enter reason for verification..."
          style={{ width: '100%', minHeight: 100, padding: 8 }}
        />
        {errors.reason && (
          <Typography color="error" fontSize="0.8rem">
            {errors.reason.message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserManagementFormDialog;