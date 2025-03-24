import { getDictionary } from '@/app/[lang]/dictionaries';

export async function getMenus(locale: string) {
  const dictionary = await getDictionary(locale);
  const { sidebar } = dictionary;
  return [
    {
      label: 'Quick Links',
      path: `/${locale}/quick-links`,
      icon: 'quickLaunch'
    },
    {
      label: sidebar.menu.home,
      children: [
        {
          path: `/${locale}/dashboard`,
          label: sidebar.menuItem.dashboard,
          icon: 'dashboard',
        }
      ],
    },
    {
      label: sidebar.menu.processApproval,
      children: [
        {
          path: `/${locale}/requisitions`,
          label: sidebar.menuItem.requisitions,
          icon: 'requisitions',
        },
        {
          path: `/${locale}/requisition-approvals`,
          label: sidebar.menuItem.approvals,
          icon: 'approvals',
        }
      ],
    },

    {
      label: sidebar.menu.card,
      children: [
        {
          path: `/${locale}/widgets`,
          label: sidebar.menuItem.widgets,
          icon: 'widget',
        },
        {
          path: `/${locale}/metrics`,
          label: sidebar.menuItem.metrics,
          icon: 'metric',
        },
      ],
    },
    
  ];
}
