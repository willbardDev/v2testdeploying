'use client';
import { NotificationsPopover } from '@/components/NotificationsPopover';
import {
  useJumboLayout,
  useSidebarState,
} from '@jumbo/components/JumboLayout/hooks';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';

import { SIDEBAR_STYLES } from '@jumbo/utilities/constants';

import { TranslationPopover } from '@/components/TranslationPopover';
import { Stack, useMediaQuery } from '@mui/material';
import React from 'react';
import { AuthUserPopover } from '../AuthUserPopover';
import { Logo } from '../Logo';
import { SidebarToggleButton } from '../SidebarToggleButton';
import { Search } from './Search';
import { SearchIconButtonOnSmallScreen } from './SearchIconButtonOnSmallScreen';
import { ThemeModeOption } from './ThemeModeOptions';
import { useSession } from 'next-auth/react';

function Header() {
  const { isSidebarStyle } = useSidebarState();

  const [searchVisibility, setSearchVisibility] = React.useState(false);
  const { theme } = useJumboTheme();
  const { headerOptions } = useJumboLayout();
  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(headerOptions?.drawerBreakpoint ?? 'xl')
  );
  const {data:session} = useSession();

  console.log(JSON.stringify(session));
  const handleSearchVisibility = React.useCallback((value: boolean) => {
    setSearchVisibility(value);
  }, []);

  return (
    <React.Fragment>
      <SidebarToggleButton />
      {isSidebarStyle(SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) && !isBelowLg && (
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      )}
      <Search show={searchVisibility} onClose={handleSearchVisibility} />
      <Stack direction='row' alignItems='center' gap={1.25} sx={{ ml: 'auto' }}>
        <ThemeModeOption />
        <TranslationPopover />
        {/* <SearchIconButtonOnSmallScreen onClick={handleSearchVisibility} /> */}
        {/* <NotificationsPopover /> */}
        <AuthUserPopover/>
      </Stack>
    </React.Fragment>
  );
}

export { Header };
