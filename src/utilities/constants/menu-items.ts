import { getDictionary } from '@/app/[lang]/dictionaries';

export async function getMenus(locale: string) {
  const dictionary = await getDictionary(locale);
  const { sidebar } = dictionary;
  return [
    {
      label: sidebar.menu.quickLinks,
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
        },
        {
          path: `/${locale}/approval-chains`,
          label: sidebar.menuItem.approvalChains,
          icon: 'approvals',
        }
      ],
    },

    {
      label: sidebar.menu.pos,
      children: [
        {
          path: `/${locale}/pos/sales-counters`,
          label: sidebar.menuItem.salesCounter,
          icon: 'counter',
        },
        {
          path: `/${locale}/pos/proformas`,
          label: sidebar.menuItem.proformas,
          icon: 'proforma',
        },
        {
          path: `/${locale}/pos/reports`,
          label: sidebar.menuItem.reports,
          icon: 'barcharts',
        },
      ],
    },

    {
      label: sidebar.menu.accounts_and_finance,
      children: [
        {
          path: `/${locale}/accounts/ledger_groups`,
          label: sidebar.menuItem.ledgerGroups,
          icon: 'counter',
        },
        {
          path: `/${locale}/accounts/ledgers`,
          label: sidebar.menuItem.ledgers,
          icon: 'proforma',
        },
        {
          path: `/${locale}/cost_centers`,
          label: sidebar.menuItem.costCenters,
          icon: 'barcharts',
        },
      ],
    },

    {
      label: sidebar.menu.masters,
      children: [
        {
          path: `/${locale}/masters/stakeholders`,
          label: sidebar.menuItem.stakeholders,
          icon: 'stakeholders',
        },
        {
          path: `/${locale}/masters/currencies`,
          label: sidebar.menuItem.currencies,
          icon: 'currencies',
        },
        {
          path: `/${locale}/masters/measurement_units`,
          label: sidebar.menuItem.measurement_units,
          icon: 'measurement_units',
        },
      ],
    },

    {
      label: sidebar.menu.organizations,
      children: [
        {
          path: `/${locale}/organizations`,
          label: sidebar.menuItem.organizations,
          icon: 'organizations',
        },
        {
          path: `/${locale}/invitations`,
          label: sidebar.menuItem.invitations,
          icon: 'invitations',
        },
      ],
    },
    
  ];
}
