import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { defaultLayoutConfig } from '@/config/layouts';
import { getMenus } from '@/services';
import { JumboLayout, JumboLayoutProvider } from '@jumbo/components';
import { getDictionary } from '@/app/[lang]/dictionaries';
import React from 'react';

interface CommonLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default async function CommonLayout({ children, params }: CommonLayoutProps) {
  const { lang }: any = await params;
  const menus: any = await getMenus(lang);
  const dictionary = await getDictionary(lang);

  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header dictionary={dictionary} />}
        footer={<Footer lang={lang} />}
        sidebar={<Sidebar menus={menus} />}
      >
        {children}
      </JumboLayout>
    </JumboLayoutProvider>
  );
}