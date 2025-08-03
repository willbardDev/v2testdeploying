import React from 'react';
import {
  DashboardOutlined,
  PointOfSaleOutlined,
  FormatListNumberedRtlOutlined,
  ChecklistOutlined,
  AssessmentOutlined,
  StoreOutlined,
  Inventory2Outlined,
  AccountBalanceOutlined,
  ReceiptOutlined,
  ShoppingCartCheckoutOutlined,
  ShoppingCartOutlined,
  StraightenOutlined,
  HandshakeOutlined,
  CorporateFareOutlined,
  ShareOutlined,
  VerifiedOutlined,
  AccountTreeOutlined,
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faUsersGear, faBarsProgress, faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { getDictionary } from '@/app/[lang]/dictionaries';

type MenuEntry = {
  label: string;
  type: 'section' | 'nav-item' | 'collapsible';
  uri?: string;
  icon?: React.ReactNode;
  children?: MenuEntry[];
};

const iconMap: Record<string, React.ReactNode> = {
  quickLaunch: <DashboardOutlined sx={{ fontSize: 20 }} />,
  dashboard: <DashboardOutlined sx={{ fontSize: 20 }} />,
  requisitions: <FormatListNumberedRtlOutlined sx={{ fontSize: 20 }} />,
  approvals: <ChecklistOutlined sx={{ fontSize: 20 }} />,
  barcharts: <AssessmentOutlined sx={{ fontSize: 20 }} />,
  counter: <PointOfSaleOutlined sx={{ fontSize: 20 }} />,
  proforma: <PointOfSaleOutlined sx={{ fontSize: 20 }} />,
  approvedPayments: <VerifiedOutlined sx={{ fontSize: 20 }} />,
  transactions: <ReceiptOutlined sx={{ fontSize: 20 }} />,
  reports: <AssessmentOutlined sx={{ fontSize: 20 }} />,
  product_categories: <Inventory2Outlined sx={{ fontSize: 20 }} />,
  products: <Inventory2Outlined sx={{ fontSize: 20 }} />,
  outlets: <StoreOutlined sx={{ fontSize: 20 }} />,
  settings: <StoreOutlined sx={{ fontSize: 20 }} />,
  stakeholders: <HandshakeOutlined sx={{ fontSize: 20 }} />,
  currencies: <AccountBalanceOutlined sx={{ fontSize: 20 }} />,
  measurement_units: <StraightenOutlined sx={{ fontSize: 20 }} />,
  organizations: <CorporateFareOutlined sx={{ fontSize: 20 }} />,
  invitations: <ShareOutlined sx={{ fontSize: 20 }} />,
  filesShelf: <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: 20 }}/>,
  prosControl: <FontAwesomeIcon icon={faUsersGear} style={{ fontSize: 20 }}/>,
  projects: <FontAwesomeIcon icon={faBarsProgress} style={{ fontSize: 20 }}/>,
  consumptions: <FontAwesomeIcon icon={faFillDrip} style={{ fontSize: 20 }}/>,
  approvedPurchases: <ShoppingCartCheckoutOutlined sx={{ fontSize: 20 }} />,
  purchases: <ShoppingCartOutlined sx={{ fontSize: 20 }} />,
};

export async function getMenus(locale: string): Promise<MenuEntry[]> {
  const dictionary = await getDictionary(locale);
  const { sidebar } = dictionary;

  return [
    {
      label: sidebar.menu.home,
      type: 'section',
      children: [
        {
          uri: `/${locale}/dashboard`,
          label: sidebar.menuItem.dashboard,
          type: 'nav-item',
          icon: iconMap['dashboard'],
        },
      ],
    },
    {
      label: sidebar.menu.processApproval,
      type: 'section',
      children: [
        {
          uri: `/${locale}/requisitions`,
          label: sidebar.menuItem.requisitions,
          type: 'nav-item',
          icon: iconMap['requisitions'],
        },
        {
          uri: `/${locale}/requisition-approvals`,
          label: sidebar.menuItem.approvals,
          type: 'nav-item',
          icon: iconMap['approvals'],
        },
        {
          label: sidebar.menuItem.approvalChains,
          type: 'collapsible',
          icon: <ChecklistOutlined sx={{ fontSize: 20 }} />,
          children: [
            {
              uri: `/${locale}/approval-chains`,
              label: sidebar.menuItem.approvalChains,
              type: 'nav-item',
              icon: <ChecklistOutlined sx={{ fontSize: 20 }} />,
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.pos,
      type: 'section',
      children: [
        {
          label: 'Sales',
          type: 'collapsible',
          icon: iconMap['counter'],
          children: [
            {
              uri: `/${locale}/pos/sales-counters`,
              label: sidebar.menuItem.salesCounter,
              type: 'nav-item',
              icon: iconMap['counter'],
            },
            {
              uri: `/${locale}/pos/proformas`,
              label: sidebar.menuItem.proformas,
              type: 'nav-item',
              icon: iconMap['proforma'],
            },
          ],
        },
        {
          uri: `/${locale}/pos/reports`,
          label: sidebar.menuItem.reports,
          type: 'nav-item',
          icon: iconMap['barcharts'],
        },
        {
          label: 'Masters',
          type: 'collapsible',
          icon: <StoreOutlined sx={{ fontSize: 20 }} />,
          children: [
            {
              uri: `/${locale}/pos/outlets`,
              label: sidebar.menuItem.outlets,
              type: 'nav-item',
            },
            {
              uri: `/${locale}/pos/price_lists`,
              label: sidebar.menuItem.priceLists,
              type: 'nav-item',
            },
            {
              uri: `/${locale}/pos/pos-settings`,
              label: sidebar.menuItem.settings,
              type: 'nav-item',
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.manufacturing,
      type: 'section',
      children: [
        {
          uri: `/${locale}/manufacturing/batches`,
          label: sidebar.menuItem.batches,
          type: 'nav-item',
          icon: <FormatListNumberedRtlOutlined sx={{ fontSize: 20 }} />,
        },
        {
          label: 'Masters',
          type: 'collapsible',
          icon: <Inventory2Outlined sx={{ fontSize: 20 }} />,
          children: [
            {
              uri: `/${locale}/manufacturing/boms`,
              label: sidebar.menuItem.boms,
              type: 'nav-item',
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.projectManagement,
      type: 'section',
      children: [
        {
          uri: `/${locale}/projectManagement/projects`,
          label: sidebar.menuItem.projects,
          type: 'nav-item',
          icon: iconMap['projects'],
        },
        {
          label: 'Masters',
          type: 'collapsible',
          icon: <AccountTreeOutlined sx={{ fontSize: 20 }} />,
          children: [
            {
              uri: `/${locale}/projectManagement/projectCategories`,
              label: sidebar.menuItem.projectCategories,
              type: 'nav-item',
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.accounts_and_finance,
      type: 'section',
      children: [
        {
          uri: `/${locale}/accounts/approvedPayments`,
          label: sidebar.menuItem.approvedPayments,
          type: 'nav-item',
          icon: iconMap['approvedPayments'],
        },
        {
          uri: `/${locale}/accounts/transactions`,
          label: sidebar.menuItem.transactions,
          type: 'nav-item',
          icon: iconMap['transactions'],
        },
        {
          uri: `/${locale}/accounts/reports`,
          label: sidebar.menuItem.reports,
          type: 'nav-item',
          icon: iconMap['reports'],
        },
        {
          label: 'Masters',
          type: 'collapsible',
          icon: <AccountBalanceOutlined sx={{ fontSize: 20 }} />,
          children: [
            {
              uri: `/${locale}/accounts/ledger_groups`,
              label: sidebar.menuItem.ledgerGroups,
              type: 'nav-item',
            },
            {
              uri: `/${locale}/accounts/ledgers`,
              label: sidebar.menuItem.ledgers,
              type: 'nav-item',
            },
            {
              uri: `/${locale}/cost_centers`,
              label: sidebar.menuItem.costCenters,
              type: 'nav-item',
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.procurementAndSupply,
      type: 'section',
      children: [
        {
          uri: `/${locale}/procurement/approvedPurchases`,
          label: sidebar.menuItem.approvedPurchases,
          type: 'nav-item',
          icon: iconMap['approvedPurchases'],
        },
        {
          uri: `/${locale}/procurement/purchases`,
          label: sidebar.menuItem.purchases,
          type: 'nav-item',
          icon: iconMap['purchases'],
        },
        {
          uri: `/${locale}/procurement/consumptions`,
          label: sidebar.menuItem.consumptions,
          type: 'nav-item',
          icon: <FontAwesomeIcon icon={faFillDrip} style={{ fontSize: 20 }}/>,
        },
        {
          uri: `/${locale}/procurement/reports`,
          label: sidebar.menuItem.reports,
          type: 'nav-item',
          icon: <AssessmentOutlined sx={{ fontSize: 20 }} />,
        },
        {
          label: 'Masters',
          type: 'collapsible',
          icon: <Inventory2Outlined sx={{ fontSize: 20 }} />,
          children: [
            {
              uri: `/${locale}/procurement/product_categories`,
              label: sidebar.menuItem.product_categories,
              type: 'nav-item',
            },
            {
              uri: `/${locale}/procurement/products`,
              label: sidebar.menuItem.products,
              type: 'nav-item',
            },
            {
              uri: `/${locale}/procurement/stores`,
              label: sidebar.menuItem.stores,
              type: 'nav-item',
            },
          ],
        },
      ],
    },
    {
      label: sidebar.menu.tools,
      type: 'section',
      children: [
        {
          uri: `/${locale}/filesShelf`,
          label: sidebar.menuItem.filesShelf,
          type: 'nav-item',
          icon: <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: 20 }}/>,
        },
      ],
    },
    {
      label: sidebar.menu.masters,
      type: 'section',
      children: [
        {
          uri: `/${locale}/masters/stakeholders`,
          label: sidebar.menuItem.stakeholders,
          type: 'nav-item',
          icon: <HandshakeOutlined sx={{ fontSize: 20 }} />,
        },
        {
          uri: `/${locale}/masters/currencies`,
          label: sidebar.menuItem.currencies,
          type: 'nav-item',
          icon: <AccountBalanceOutlined sx={{ fontSize: 20 }} />,
        },
        {
          uri: `/${locale}/masters/measurement_units`,
          label: sidebar.menuItem.measurement_units,
          type: 'nav-item',
          icon: <StraightenOutlined sx={{ fontSize: 20 }} />,
        },
      ],
    },
    {
      label: sidebar.menu.prosControl,
      type: 'section',
      children: [
        {
          uri: `/${locale}/prosControl/usersManagement`,
          label: sidebar.menuItem.usersManagement,
          type: 'nav-item',
          icon: <FontAwesomeIcon icon={faUsersGear} style={{ fontSize: 20 }}/>,
        },
      ],
    },
    {
      label: sidebar.menu.organizations,
      type: 'section',
      children: [
        {
          uri: `/${locale}/organizations`,
          label: sidebar.menuItem.organizations,
          type: 'nav-item',
          icon: <CorporateFareOutlined sx={{ fontSize: 20 }} />,
        },
        {
          uri: `/${locale}/invitations`,
          label: sidebar.menuItem.invitations,
          type: 'nav-item',
          icon: <ShareOutlined sx={{ fontSize: 20 }} />,
        },
      ],
    },
  ];
}
