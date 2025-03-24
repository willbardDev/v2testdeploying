import {
  DashboardCustomizeOutlined,
  SvgIconComponent,
  RocketLaunchOutlined,
  FormatListNumberedOutlined,
  ChecklistRtlOutlined,
  PointOfSaleOutlined,
  RequestQuoteOutlined,
  AssessmentOutlined
} from '@mui/icons-material';

import { SxProps, Theme } from '@mui/material';
import { IconType } from 'react-icons';
import {
  RiAdvertisementLine,
  RiBuildingLine,
  RiListView,
  RiLockPasswordLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiNotificationLine,
  RiSecurePaymentLine,
  RiShieldKeyholeLine,
  RiTeamLine,
  RiUser6Line,
} from 'react-icons/ri';
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
  { name: 'dashboard', Component: DashboardCustomizeOutlined, props: { sx: { fontSize: 20 } } },
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
  },{
    name: 'barcharts',
    Component: AssessmentOutlined,
    props: { sx: { fontSize: 20 } },
  }
];

export { APP_ICONS, type Icon };
