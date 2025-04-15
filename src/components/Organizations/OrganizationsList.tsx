'use client';

import React, { createContext, useRef, useCallback, useEffect, useState } from 'react';
import { Alert, Card, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import OrganizationListItem from './OrganizationListItem';
import { AddOutlined } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PROS_CONTROL_PERMISSIONS } from '@jumbo/utilities/constants/prosControlPermissions';
import Link from 'next/link';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';
import organizationServices from '@/lib/services/organizationServices';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Organization {
  id: string;
  [key: string]: any;
}

interface QueryOptions<TQueryKey> {
  queryKey: string;
  queryParams: {
    id?: string;
    keyword: string;
  };
  countKey: string;
  dataKey: string;
}

interface OrganizationListContextType {
  refetchOrganizations: () => void;
}

export const OrganizationListContext = createContext<OrganizationListContextType>({
  refetchOrganizations: () => {},
});

interface OrganizationsListProps {
  user: User;
}

const OrganizationsList: React.FC<OrganizationsListProps> = ({ user }) => {
  const router = useRouter();
  const listRef = useRef<{ refresh: () => Promise<void> }>(null);
  const { checkPermission } = useJumboAuth();

  const canAddOrganization = checkPermission([PROS_CONTROL_PERMISSIONS.ORGANIZATIONS_MANAGE]);

  const [queryOptions, setQueryOptions] = useState<
    QueryOptions<[string, { id?: string; keyword: string }]>
  >({
    queryKey: 'organizations',
    queryParams: { id: user.id, keyword: '' },
    countKey: 'total',
    dataKey: 'data',
  });

  React.useEffect(() => {
    setQueryOptions(prev => ({
      ...prev,
      queryKey: 'organizations',
      queryParams: { ...prev.queryParams, id: user.id },
    }));
  }, [user]);

  const renderOrganization = useCallback((organization: Organization) => {
    return organization ? (
      <OrganizationListItem organization={organization} />
    ) : (
      <Alert variant="outlined" severity="info">
        <span>No ProsERP organizations for you. </span>
        <span>
          Join one from the <Link href={'/invitations'}>invitations</Link> sent to your email
        </span>
      </Alert>
    );
  }, []);

  const handleOnChange = useCallback((keyword: string) => {
    setQueryOptions(prev => ({
      ...prev,
      queryKey: 'organizations',
      queryParams: {
        ...prev.queryParams,
        keyword,
      },
    }));
  }, []);

  const refetchOrganizations = useCallback(() => {
    listRef.current?.refresh();
  }, []);

  const wrapperSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <OrganizationListContext.Provider value={{ refetchOrganizations }}>
      <React.Fragment>
        <Typography variant={'h4'} mb={2}>Organizations</Typography>
        <JumboRqList
          ref={listRef}
          wrapperComponent={Card}
          service={organizationServices.getList}
          primaryKey={"id"}
          queryOptions={queryOptions}
          itemsPerPage={10}
          itemsPerPageOptions={[8, 10, 15, 20]}
          renderItem={renderOrganization}
          componentElement={"div"}
          wrapperSx={wrapperSx}
          toolbar={
            <JumboListToolbar
              hideItemsPerPage={true}
              actionTail={
                <Stack direction={'row'}>
                  <JumboSearch
                    onChange={handleOnChange}
                    value={queryOptions.queryParams.keyword}
                  />
                  {canAddOrganization && (
                    <Tooltip title='New Organization'>
                      <IconButton onClick={() => router.push('/organizations/create')}>
                        <AddOutlined />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              }
            />
          }
        />
      </React.Fragment>
    </OrganizationListContext.Provider>
  );
};

export default OrganizationsList;