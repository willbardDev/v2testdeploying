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
        {
          path: `/${locale}/pos/outlets`,
          label: sidebar.menuItem.outlets,
        },
        {
          path: `/${locale}/pos/price_lists`,
          label: sidebar.menuItem.priceLists,
        },
        {
          path: `/${locale}/pos/pos-settings`,
          label: sidebar.menuItem.settings,
        },
      ],
    },

    {
      label: sidebar.menu.manufacturing,
      children: [
        {
          path: `/${locale}/manufacturing/batches`,
          label: sidebar.menuItem.batches,
          icon: 'batches',
        },
        {
          path: `/${locale}/manufacturing/boms`,
          label: sidebar.menuItem.boms,
        },
      ],
    },

    {
      label: sidebar.menu.projectManagement,
      children: [
        {
          path: `/${locale}/projectManagement/projectCategories`,
          label: sidebar.menuItem.projectCategories,
        },
      ],
    },

    {
      label: sidebar.menu.accounts_and_finance,
      children: [
        {
          path: `/${locale}/accounts/approvedPayments`,
          label: sidebar.menuItem.approvedPayments,
          icon: 'approvedPayments',
        },
        {
          path: `/${locale}/accounts/transactions`,
          label: sidebar.menuItem.transactions,
          icon: 'transactions',
        },
        {
          path: `/${locale}/accounts/reports`,
          label: sidebar.menuItem.reports,
          icon: 'barcharts',
        },
        {
          path: `/${locale}/accounts/ledger_groups`,
          label: sidebar.menuItem.ledgerGroups,
        },
        {
          path: `/${locale}/accounts/ledgers`,
          label: sidebar.menuItem.ledgers,
        },
        {
          path: `/${locale}/cost_centers`,
          label: sidebar.menuItem.costCenters,
        },
      ],
    },

    {
      label: sidebar.menu.procurementAndSupply,
      children: [
        {
          path: `/${locale}/procurement/approvedPurchases`,
          label: sidebar.menuItem.approvedPurchases,
          icon: 'approvedPurchases',
        },
        {
          path: `/${locale}/procurement/purchases`,
          label: sidebar.menuItem.purchases,
          icon: 'purchases',
        },
        {
          path: `/${locale}/procurement/consumptions`,
          label: sidebar.menuItem.consumptions,
          icon: 'consumptions',
        },
        {
          path: `/${locale}/procurement/reports`,
          label: sidebar.menuItem.reports,
          icon: 'barcharts',
        },
        {
          path: `/${locale}/procurement/product_categories`,
          label: sidebar.menuItem.product_categories,
        },
        {
          path: `/${locale}/procurement/products`,
          label: sidebar.menuItem.products,
        },
        {
          path: `/${locale}/procurement/stores`,
          label: sidebar.menuItem.stores,
        },
      ],
    },

    {
      label: sidebar.menu.tools,
      children: [
        {
          path: `/${locale}/filesShelf`,
          label: sidebar.menuItem.filesShelf,
          icon: 'filesShelf',
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
      label: sidebar.menu.prosControl,
      children: [
        {
          path: `/${locale}/prosControl/usersManagement`,
          label: sidebar.menuItem.usersManagement,
          icon: 'usersManagement',
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
