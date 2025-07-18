'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Stack, Typography, Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboSearch from '@jumbo/components/JumboSearch';

import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { MODULES } from '@/utilities/constants/modules';
import { PERMISSIONS } from '@/utilities/constants/permissions';

import UnsubscribedAccess from '@/shared/Information/UnsubscribedAccess';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';

import userManagementServices from './user-management-services';
import { UserManager } from './UserManagementType';
import UserManagementActionTail from './UserManagementActionTail';

const UserManagement = () => {
  const params = useParams();
  const listRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const { organizationHasSubscribed, checkOrganizationPermission } = useJumboAuth();
  const [mounted, setMounted] = useState(false);

  const [queryOptions, setQueryOptions] = useState({
    queryKey: 'userManagement',
    queryParams: { id: params.id, keyword: '' },
    countKey: 'total',
    dataKey: 'data',
  });

  const canReadUsers = true
  const canManageUsers = true

  useEffect(() => {
    setQueryOptions((state) => ({
      ...state,
      queryParams: { ...state.queryParams, id: params.id },
    }));
  }, [params]);

  const handleSearchChange = useCallback((keyword: string) => {
    setQueryOptions((state) => ({
      ...state,
      queryParams: {
        ...state.queryParams,
        keyword,
      },
    }));
  }, []);

  const { mutate: verifyUser } = useMutation({
    mutationFn: (email: string) => userManagementServices.verifyUser(email),
    onSuccess: () => {
      enqueueSnackbar('User verified successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },
    onError: () => {
      enqueueSnackbar('Failed to verify user', { variant: 'error' });
    },
  });

  const { mutate: deactivateUser } = useMutation({
    mutationFn: (id: number) => userManagementServices.deactivateUser(id),
    onSuccess: () => {
      enqueueSnackbar('User deactivated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },
    onError: () => {
      enqueueSnackbar('Failed to deactivate user', { variant: 'error' });
    },
  });

  const { mutate: reactivateUser } = useMutation({
    mutationFn: (id: number) => userManagementServices.reactivateUser(id),
    onSuccess: () => {
      enqueueSnackbar('User reactivated successfully', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },
    onError: () => {
      enqueueSnackbar('Failed to reactivate user', { variant: 'error' });
    },
  });

  const renderUserItem = useCallback((user: UserManager) => (
    <Card sx={{ p: 2, mb: 2 }} key={user.id}>
      <Typography variant="h6">{user.name}</Typography>
      <Typography variant="body2">{user.email}</Typography>

      {canManageUsers && (
        <Stack direction="row" spacing={1} mt={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => verifyUser(user.email)}
            disabled={user.is_verified}
          >
            {user.is_verified ? 'Verified' : 'Verify'}
          </Button>

          {user.is_active ? (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => deactivateUser(user.id)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="success"
              onClick={() => reactivateUser(user.id)}
            >
              Reactivate
            </Button>
          )}
        </Stack>
      )}
    </Card>
  ), [canManageUsers, verifyUser, deactivateUser, reactivateUser]);

    useEffect(() => {
          setMounted(true);
      }, []);

  if (!mounted) return null;

 if (!organizationHasSubscribed("user_management")) {
  return <UnsubscribedAccess modules="User Management" />;
}


  if (!canReadUsers) {
    return <UnauthorizedAccess />;
  }

  return (
    <>
      <Typography variant="h4" mb={2}>
        User Management
      </Typography>

      <JumboRqList
        ref={listRef}
        wrapperComponent={Card}
        service={userManagementServices.getList}
        primaryKey="id"
        queryOptions={queryOptions}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 20]}
        renderItem={renderUserItem}
        componentElement="div"
        wrapperSx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        toolbar={
          <JumboListToolbar
            hideItemsPerPage
            actionTail={
              <Stack direction="row" spacing={2}>
                <JumboSearch
                  onChange={handleSearchChange}
                  value={queryOptions.queryParams.keyword}
                />
                <UserManagementActionTail/>
              </Stack>
            }
          />
        }
      />
    </>
  );
};

export default UserManagement;
