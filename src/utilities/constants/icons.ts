import {
  DashboardCustomizeOutlined,
  SvgIconComponent,
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
  ReportOffOutlined,
  ReceiptOutlined
} from '@mui/icons-material';

import { SxProps, Theme } from '@mui/material';
import { IconType } from 'react-icons';
type Icon = {
  name: string;
  Component: SvgIconComponent | IconType;
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
  { name: 'dashboard', 
    Component: DashboardCustomizeOutlined, 
    props: { sx: { fontSize: 20 } } 
  },
  {
    name: 'requisitions',
    Component: FormatListNumberedOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'approvals',
    Component: ChecklistRtlOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'counter',
    Component: PointOfSaleOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'proforma',
    Component: RequestQuoteOutlined,
    props: { sx: { fontSize: 20 } },
  },
  {
    name: 'transactions',
    Component: ReceiptOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'barcharts',
    Component: AssessmentOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'organizations',
    Component: CorporateFareOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'invitations',
    Component: ShareOutlined,
    props: { sx: { fontSize: 20 } },
  },{ name: 'stakeholders',
    Component: HandshakeOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'currencies',
    Component: CurrencyExchangeOutlined,
    props: { sx: { fontSize: 20 } },
  },{
    name: 'measurement_units',
    Component: StraightenOutlined,
    props: { sx: { fontSize: 20 } },
  }
];

export { APP_ICONS, type Icon };
