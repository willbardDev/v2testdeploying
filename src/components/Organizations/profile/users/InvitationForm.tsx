'use client';

import * as yup from "yup";
import React, { useState } from 'react';
import { Grid, LinearProgress, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { InvitationQueue } from './InvitationQueue';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from "@tanstack/react-query";
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
  const { enqueueSnackbar } = useSnackbar();

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
    defaultValues: { email: '' },
  });

  const { data: organizationRoles, isPending: isRolesLoading } = useQuery({
    queryKey: [`organizationRoles_${organization?.id}`],
    queryFn: async () => {
      const response = await axios.get(`/organizations/${organization.id}/roles`);
      return response.data;
    },
    enabled: !!organization?.id,
  });

  const { mutate: addInvitee, isPending: isAddingInvitee } = useMutation({
    mutationFn: async ({ email }: FormValues) => {
      const response = await organizationServices.addInvitee(organization.id, email);
      return response.user;
    },
    onSuccess: (user, variables) => {
      const newInvitee: Invitee = {
        ...user,
        id: user.id || Date.now(),
        roles: organizationRoles || [],
        selectedRoles: [],
      };

      if (invitees.some(invitee => invitee.email === newInvitee.email)) {
        enqueueSnackbar('User is already in the queued list', { variant: 'error' });
      } else {
        setInvitees(prev => [...prev, newInvitee]);
        reset();
      }
    },
    onError: (error: any, variables) => {
      if (error?.response?.status === 404) {
        const fallbackUser: Invitee = {
          id: Date.now(),
          name: 'Not Registered',
          email: variables.email,
          selectedRoles: [],
        };

        if (invitees.some(invitee => invitee.email === fallbackUser.email)) {
          enqueueSnackbar('User is already in the queued list', { variant: 'error' });
          reset();
        } else {
          enqueueSnackbar('No user with that email was found. An invitation to register will be sent instead.', { variant: 'info' });
          setInvitees(prev => [...prev, fallbackUser]);
          reset();
        }
      } else {
        console.log(error?.response?.data?.message)
        enqueueSnackbar(error?.response?.data?.message || 'An error occurred', { variant: 'error' });
        reset();
      }
    }
  });

  const onSubmit = (data: FormValues) => {
    addInvitee(data);
  };

  if (isRolesLoading) {
    return <LinearProgress />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container columnSpacing={1} paddingRight={1} alignItems="center">
        <Grid size={10}>
          <TextField
            label="Email"
            fullWidth
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
        </Grid>
        <Grid size={2}>
          <LoadingButton 
            size="small"
            variant="contained"
            type="submit"
            loading={isAddingInvitee}
            fullWidth
          >
            Add
          </LoadingButton>
        </Grid>
      </Grid>

      <InvitationQueue 
        invitees={invitees}
        setInvitees={setInvitees}
        organization={organization}
      />
    </form>
  );
};
