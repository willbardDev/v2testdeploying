'use client';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { List } from '@mui/material';
import React from 'react';
import { ContentLayout } from '../ContentLayout';
import { NavSectionSettingItem } from './NavSectionSettingItem';
import { NavSettingItem } from './NavSettingItem';

const useSettingLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      sidebarOptions: {
        sx: {
          width: 240,
          display: 'flex',
          minWidth: 0,
          flexShrink: 0,
          flexDirection: 'column',
          mr: 4,
          [theme.breakpoints.up('lg')]: {
            position: 'sticky',
            zIndex: 5,
            top: 112,
          },
          [theme.breakpoints.down('lg')]: {
            display: 'none',
          },
        },
      },
      wrapperOptions: {
        sx: {
          alignItems: 'flex-start',
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, sm: 0, xs: 0 },
        },
      },
    }),
    [theme]
  );
};

const SettingLayoutContent = ({ children, menus }: any) => {
  const settingsLayoutConfig = useSettingLayout();
  return (
    <ContentLayout
      sidebar={
        menus?.length > 0 && (
          <List
            disablePadding
            sx={{
              pb: 2,
            }}
          >
            {menus?.map((item: any, index: number) => (
              <React.Fragment key={index}>
                <NavSectionSettingItem
                  item={item}
                  key={index}
                  isFirstSection={true}
                  primary={index}
                />
                {item?.children?.map((item: any, index: number) => (
                  <NavSettingItem navItem={item} key={index} />
                ))}
              </React.Fragment>
            ))}
          </List>
        )
      }
      {...settingsLayoutConfig}
    >
      {children}
    </ContentLayout>
  );
};
export { SettingLayoutContent };
