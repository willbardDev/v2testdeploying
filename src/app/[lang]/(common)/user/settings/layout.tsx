import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { SettingLayoutContent } from '@/layouts/SettingLayoutContent';
import { getSettingMenus } from '@/services/setting-menu-services';
import { Params } from '@/types/paramsType';
import { MenuItems } from '@jumbo/types';
import { Container } from '@mui/material';
import React from 'react';

export default async function SettingLayout(
  props: {
    children: React.ReactNode;
  } & Params
) {
  const params = await props.params;

  const { children } = props;

  const { lang } = params;
  const menus: MenuItems = await getSettingMenus(lang);
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <SettingLayoutContent menus={menus}>{children}</SettingLayoutContent>
    </Container>
  );
}
