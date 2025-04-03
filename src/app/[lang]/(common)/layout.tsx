import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { defaultLayoutConfig } from '@/config/layouts';
import { getMenus } from '@/services';
import { Params } from '@/types/paramsType';
import { JumboLayout, JumboLayoutProvider } from '@jumbo/components';
import { MenuItems } from '@jumbo/types';
import { getDictionary } from '@/app/[lang]/dictionaries';
import React from 'react';

interface CommonLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default async function CommonLayout({ children, params }: CommonLayoutProps) {
  const { lang } = params;
  const menus: MenuItems = await getMenus(lang);
  const dictionary = await getDictionary(lang);

  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header lang={lang} dictionary={dictionary} />}
        footer={<Footer lang={lang} />}
        sidebar={<Sidebar menus={menus} />}
      >
        {children}
      </JumboLayout>
    </JumboLayoutProvider>
  );
}