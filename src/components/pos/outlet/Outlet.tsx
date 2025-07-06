'use client';

import React, { createContext, useEffect, useRef, useState } from 'react';
import { Card, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import JumboListToolbar from '@jumbo/components/JumboList/components/JumboListToolbar';
import JumboRqList from '@jumbo/components/JumboReactQuery/JumboRqList';
import JumboSearch from '@jumbo/components/JumboSearch';

import OutletListItem from './OutletListItem';
import LedgerSelectProvider from '@/components/accounts/ledgers/forms/LedgerSelectProvider';

import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { MODULES } from '@/utilities/constants/modules';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import UnsubscribedAccess from '@/shared/Information/UnsubscribedAccess';
import UnauthorizedAccess from '@/shared/Information/UnauthorizedAccess';

import outletService from './OutletServices';
import type { Outlet } from './OutletType';
import OutletActionTail from './OutletActionTail';

type myType = Outlet;

export const OutletListContext = createContext({});

const Outlet = () => {
  const params = useParams();
  const listRef = useRef(null);
  const { organizationHasSubscribed, checkOrganizationPermission } = useJumboAuth();
  const [mounted, setMounted] = useState(false);

  const [queryOptions, setQueryOptions] = useState({
    queryKey: 'sales_outlet',
    queryParams: { id: params.id, keyword: '' },
    countKey: 'total',
    dataKey: 'data',
  });

  useEffect(() => {
    setQueryOptions((prev) => {
      if (prev.queryParams.id === params.id) return prev;
      return {
        ...prev,
        queryParams: {
          ...prev.queryParams,
          id: params.id,
        },
      };
    });
  }, [params.id]);

 const handleOnChange = (keyword: string) => {
  setQueryOptions((state) => {
    if (state.queryParams.keyword === keyword) return state;
    return {
      ...state,
      queryParams: {
        ...state.queryParams,
        keyword,
      },
    };
  });
};


  // 🧠 Memoized render function for items
  const renderOutlet = React.useCallback((outlet: Outlet) => {
    return <OutletListItem outlet={outlet} />;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!organizationHasSubscribed(MODULES.POINT_OF_SALE)) {
    return <UnsubscribedAccess modules="Point of Sale (POS)" />;
  }

  if (!checkOrganizationPermission([PERMISSIONS.OUTLETS_READ])) {
    return <UnauthorizedAccess />;
  }

  return (
    <OutletListContext.Provider value={{}}>
      <LedgerSelectProvider>
        <Typography variant="h4" mb={2}>
          Sales Outlets
        </Typography>

        <JumboRqList
          ref={listRef}
          wrapperComponent={Card}
          service={outletService.getList}
          primaryKey="id"
          queryOptions={queryOptions}
          itemsPerPage={10}
          itemsPerPageOptions={[5, 10, 15, 20]}
          renderItem={renderOutlet}
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
                <Stack direction="row">
                  <JumboSearch
                    onChange={handleOnChange}
                    value={queryOptions.queryParams.keyword}
                  />
                  <OutletActionTail />
                </Stack>
              }
            />
          }
        />
      </LedgerSelectProvider>
    </OutletListContext.Provider>
  );
};

export default Outlet;
