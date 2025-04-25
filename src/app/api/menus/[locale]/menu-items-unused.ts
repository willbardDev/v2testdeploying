import { getDictionary } from '@/app/[lang]/dictionaries';

export async function getMenus(locale: string) {
  const dictionary = await getDictionary(locale);
  const { sidebar } = dictionary;

  return [
    {
      label: sidebar.menu.home,
      children: [
        {
          path: `/${locale}/dashboard`,
          label: sidebar.menuItem.misc,
          icon: 'home',
        },
      ],
    },
  ];
}
