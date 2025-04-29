'use client'

import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import React from 'react';
import { Grid, TextField } from '@mui/material';
import { useOrganizationProfile } from '../OrganizationProfileProvider';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import organizationServices from '@/lib/services/organizationServices';

interface FormValues {
  name: string;
  description?: string;
  organization_id: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

interface ApiErrorResponse {
  message?: string;
  validation_errors?: ValidationErrors;
}

interface AddRoleResponse {
  message: string;
}

export const NewRoleForm = () => {
  const { organization } = useOrganizationProfile();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = yup.object({
    name: yup.string().required('Role name required'),
    description: yup.string().optional(),
    organization_id: yup.string().required(),
  });

  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      organization_id: organization?.id,
    },
  });

  const addRole = useMutation<AddRoleResponse, AxiosError<ApiErrorResponse>, FormValues>({
    mutationFn: (data: FormValues) => organizationServices.addRole(data),
    onSuccess: (data) => {
      enqueueSnackbar(data.message, {
        variant: 'success',
      });
      queryClient.invalidateQueries({ 
        queryKey: [`organizationRoles`] 
      });
      reset();
    },
    onError: (error) => {
      if (
        error?.response?.data &&
        error?.response?.status === 400 &&
        error?.response?.data?.validation_errors
      ) {
        const validationErrors = error.response.data.validation_errors;
        Object.keys(validationErrors).forEach((fieldName) => {
          const errorMessages = validationErrors[fieldName];
          setError(fieldName as keyof FormValues, {
            type: 'manual',
            message: errorMessages.join('<br/>'),
          });
        });
      } else {
        enqueueSnackbar(
          error?.response?.data?.message || 'An error occurred', 
          { variant: 'error' }
        );
      }
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => addRole.mutate(data))} autoComplete="off">
      <Grid container columnSpacing={1} rowSpacing={1}>
        <Grid size={{xs: 12, md: 4}}>
          <TextField
            fullWidth
            label="Name"
            size="small"
            error={!!errors?.name}
            helperText={errors?.name?.message}
            {...register('name')}
          />
        </Grid>
        <Grid size={{xs: 12, md: 6, lg: 7}}>
          <TextField
            fullWidth
            label="Description"
            size="small"
            error={!!errors?.description}
            helperText={errors?.description?.message}
            {...register('description')}
          />
        </Grid>
        <Grid size={{xs: 12, md: 2, lg: 1}}>
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            fullWidth
            sx={{ mb: 2, display: 'flex' }}
            loading={addRole.isPending}
          >
            Add
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};