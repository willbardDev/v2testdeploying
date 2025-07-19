'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Stack, Typography } from '@mui/material';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboSearch from '@jumbo/components/JumboSearch';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';
import userManagementServices from './user-management-services';
import { UserManager } from './UserManagementType';
import { PROS_CONTROL_PERMISSIONS } from '@/utilities/constants/prosControlPermissions';
import UserManagementActionTail from './UserManagementActionTail';

const UserManagement = () => {
  const params = useParams();
  const listRef = useRef<any>(null);
  const { checkPermission } = useJumboAuth();
  const [mounted, setMounted] = useState(false);

  const [queryOptions, setQueryOptions] = useState({
    queryKey: 'userManagement',
    queryParams: { id: params.id, keyword: '' },
    countKey: 'total',
    dataKey: 'data',
  });

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

  const renderUserItem = useCallback(
    (user: UserManager) => (
      <Card sx={{ p: 2, mb: 2 }} key={user.id}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={0.5}>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Stack>
        </Stack>
      </Card>
    ),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 🔐 PERMISSION CHECK:
  // The user must have at least one of the following permissions to access this page:
  //
  // PROS_CONTROL_PERMISSIONS.USERS_MANAGE = 'SystemUsers:Manage'
  // -> Allows managing users (e.g., add/edit/delete users)
  //
  // PROS_CONTROL_PERMISSIONS.USERS_READ = 'SystemUsers:Read'
  // -> Allows viewing user data (read-only access)
//  const hasPermission = checkPermission([
 //   PROS_CONTROL_PERMISSIONS.USERS_MANAGE,
 //   PROS_CONTROL_PERMISSIONS.USERS_READ,
 // ]);

  //if (!hasPermission) {
    // If user has neither manage nor read permission, deny access.
  //  return <UnauthorizedAccess />;
 // }

  return (
    <>
      <Typography variant="h4" mb={2}>
        User Management
      </Typography>

      <JumboRqList
        ref={listRef}
        wrapperComponent={Card}
        service={userManagementServices.getList}
        primaryKey={"id"}
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
                <UserManagementActionTail />
              </Stack>
            }
          />
        }
      />
    </>
  );
};

export default UserManagement;
