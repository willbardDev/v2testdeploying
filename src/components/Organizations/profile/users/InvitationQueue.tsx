'use client'

import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { LoadingButton } from '@mui/lab';
import { Box, List } from '@mui/material';
import { Stack } from '@mui/system';
import { useSnackbar } from 'notistack';
import React from 'react';
import { InvitationQueueItem } from './InvitationQueueItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import organizationServices from '@/lib/services/organizationServices';
import { Organization } from '@/types/auth-types';

interface Invitee {
  id: string | number;
  email: string;
  name: string;
  selectedRoles: (string | number)[];
  roles?: Array<{ id: string | number; name: string }>;
}

interface InvitationQueueProps {
  invitees: Invitee[];
  setInvitees: React.Dispatch<React.SetStateAction<Invitee[]>>;
  organization: Organization;
}

interface InvitationsData {
  id: string | number;
  selectedRoles: (string | number)[];
}

export const InvitationQueue: React.FC<InvitationQueueProps> = ({ 
  invitees, 
  setInvitees, 
  organization 
}) => {
  const { hideDialog } = useJumboDialog();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // Validate invitees and prepare data
  const validateAndPrepareData = (): InvitationsData[] | null => {
    const invalidInvitees = invitees.filter((invitee) => invitee.selectedRoles.length < 1);

    if (invalidInvitees.length > 0) {
      enqueueSnackbar('Please select at least one role for each invited user', { variant: 'error' });
      return null;
    }

    return invitees.map((invitee) => ({
      id: invitee.id,
      selectedRoles: invitee.selectedRoles,
    }));
  };

  // Mutation for inviting users
  const inviteUsers = useMutation({
    mutationFn: (invitationsData: InvitationsData[]) => 
      organizationServices.inviteUsers(organization?.id, invitationsData),
    onSuccess: () => {
      enqueueSnackbar('Invitations sent successfully', { variant: 'success' });
      queryClient.invalidateQueries({ 
        queryKey: [`organizationUsers_${organization?.id}`] 
      });
      hideDialog();
    },
    onError: () => {
      enqueueSnackbar('Invitations sent with errors', { variant: 'warning' });
    },
  });

  const handleSendInvitations = () => {
    const invitationsData = validateAndPrepareData();
    if (invitationsData) {
      inviteUsers.mutate(invitationsData);
    }
  };

  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="center">
      {invitees.length > 0 && (
        <>
          <List
            sx={{
              width: '100%',
              mb: 2,
              bgcolor: 'background.paper',
            }}
          >
            {invitees.map((invitee) => (
              <InvitationQueueItem
                key={invitee.email}
                setInvitees={setInvitees}
                invitees={invitees}
                invitee={invitee}
              />
            ))}
          </List>
          <Box sx={{ width: '100%' }} display="flex" justifyContent="flex-end">
            <LoadingButton
              type="button"
              variant="contained"
              size="small"
              sx={{ mb: 3 }}
              onClick={handleSendInvitations}
              loading={inviteUsers.isPending}
              disabled={inviteUsers.isPending}
            >
              Send Invitations
            </LoadingButton>
          </Box>
        </>
      )}
    </Stack>
  );
};