import {
  DashboardCustomizeOutlined,
  RocketLaunchOutlined,
  FormatListNumberedOutlined,
  ChecklistRtlOutlined,
  PointOfSaleOutlined,
  RequestQuoteOutlined,
  AssessmentOutlined,
  CorporateFareOutlined,
  ShareOutlined,
  CurrencyExchangeOutlined,
  HandshakeOutlined,
  StraightenOutlined,
  ReceiptOutlined,
  ShoppingCartOutlined,
  OutdoorGrillOutlined,
  FolderOutlined, // MUI equivalent for faFolderOpen
  ManageAccountsOutlined,
  VerifiedOutlined,
  ShoppingCartCheckout,
  QrCode
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

type Icon = {
  name: string;
  Component: React.ComponentType<SvgIconProps>;
  props?: {
    sx?: SxProps<Theme>;
  };
};

const APP_ICONS: Icon[] = [
  {
    name: 'quickLaunch',
    Component: RocketLaunchOutlined,
    props: { sx: { fontSize: 20 } }
  },
  { 
    name: 'dashboard', 
    Component: DashboardCustomizeOutlined, 
    props: { sx: { fontSize: 20 } } 
  },
  {
    name: 'requisitions',
    Component: FormatListNumberedOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'approvals',
    Component: ChecklistRtlOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'approvedPayments',
    Component: VerifiedOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'approvedPurchases',
    Component: ShoppingCartCheckout,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'counter',
    Component: PointOfSaleOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'proforma',
    Component: RequestQuoteOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'transactions',
    Component: ReceiptOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'purchases',
    Component: ShoppingCartOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'consumptions',
    Component: OutdoorGrillOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'barcharts',
    Component: AssessmentOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'organizations',
    Component: CorporateFareOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'batches',
    Component: QrCode,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'invitations',
    Component: ShareOutlined,
    props: { sx: { fontSize: 20 } }
  },
  { 
    name: 'stakeholders',
    Component: HandshakeOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'currencies',
    Component: CurrencyExchangeOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'measurement_units',
    Component: StraightenOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'filesShelf',
    Component: FolderOutlined,
    props: { sx: { fontSize: 20 } }
  },
  {
    name: 'usersManagement',
    Component: ManageAccountsOutlined,
    props: { sx: { fontSize: 20 } }
  }
];

export { APP_ICONS, type Icon };