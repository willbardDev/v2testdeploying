'use client'

import * as yup from "yup";
import React, { useState } from 'react';
import { Grid, LinearProgress, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { InvitationQueue } from './InvitationQueue';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/services/config";
import organizationServices from "@/lib/services/organizationServices";
import { Organization } from "@/types/auth-types";

interface FormValues {
  email: string;
}

interface InvitationFormProps {
  organization: Organization;
}

interface Invitee {
  id: string | number;
  email: string;
  name: string;
  roles?: Array<{ id: string | number; name: string }>;
  selectedRoles: (string | number)[];
}

export const InvitationForm: React.FC<InvitationFormProps> = ({ organization }) => {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  // ValidationSchema
  const validationSchema = yup.object({
    email: yup.string()
      .required('Email is required')
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        { message: 'Invalid email format' },
      ),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
    }
  });

  const { data: organizationRoles, isLoading } = useQuery({
    queryKey: [`organizationRoles_${organization?.id}`],
    queryFn: async () => {
      const response = await axios.get(`/organizations/${organization.id}/roles`);
      return response.data;
    },
    enabled: !!organization?.id
  });

  const addInvitee = async ({ email }: FormValues) => {
    try {
      setLoading(true);
      const response = await organizationServices.addInvitee(organization?.id, email);

      const user: Invitee = {
        ...response.user,
        id: response.user.id || Date.now(), // Ensure id is always defined
        roles: organizationRoles,
        selectedRoles: [],
      };

      if (invitees.some(invitee => invitee.email === user.email)) {
        enqueueSnackbar('User is already in the queued list', { variant: 'error' });
      } else {
        setInvitees([...invitees, user]);
        reset();
      }
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 404) {
          const user: Invitee = {
            id: Date.now(), // Generate temporary id for unregistered users
            name: 'Not Registered',
            email: email,
            selectedRoles: [],
          };

          let message;
          if (invitees.some(invitee => invitee.email === user.email)) {
            message = 'User is already in the queued list';
            reset();
          } else {
            message = 'No user with that email was found. An invitation to register will be sent instead.';
            setInvitees([...invitees, user]);
            reset();
          }

          enqueueSnackbar(message, { variant: 'info' });
        } else {
          enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
          reset();
        }
      } else {
        enqueueSnackbar('An error occurred', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <form onSubmit={handleSubmit(addInvitee)}>
      <Grid container columnSpacing={1} paddingRight={1}>
        <Grid size={{xs: 10}}>
          <TextField
            label="Email"
            fullWidth
            size="small"
            error={!!errors?.email}
            helperText={errors?.email?.message}
            {...register('email')}
          />
        </Grid>
        <Grid size={{xs: 2}}>
          <LoadingButton 
            size="small"
            variant="contained"
            type="submit"
            sx={{ mb: 4, display: 'flex' }}
            loading={loading}
            disabled={loading}
          >
            Add
          </LoadingButton>
        </Grid>
      </Grid>
      <InvitationQueue 
        invitees={invitees}
        setinvitees={setInvitees}
        organization={organization}
      />
    </form>
  );
};