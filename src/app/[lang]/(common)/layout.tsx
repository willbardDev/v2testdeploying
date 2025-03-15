import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { defaultLayoutConfig } from '@/config/layouts';
import { getMenus } from '@/services';
import { Params } from '@/types/paramsType';
import { JumboLayout, JumboLayoutProvider } from '@jumbo/components';
import { MenuItems } from '@jumbo/types';
import React from 'react';

export default async function CommonLayout(
  props: {
    children: React.ReactNode;
  } & Params
) {
  const params = await props.params;

  const { children } = props;

  const { lang } = params;
  const menus: MenuItems = await getMenus(lang);
  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header />}
        footer={<Footer lang={lang} />}
        sidebar={<Sidebar menus={menus} />}
      >
        {children}
      </JumboLayout>
    </JumboLayoutProvider>
  );
}
