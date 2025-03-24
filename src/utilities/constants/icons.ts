import {
  CreditCardOutlined,
  DashboardCustomizeOutlined,
  DeveloperBoardOutlined,
  FacebookOutlined,
  HandshakeOutlined,
  Instagram,
  LinkedIn,
  Mail,
  MessageOutlined,
  NotificationsActiveRounded,
  PaymentOutlined,
  Refresh,
  Settings,
  SettingsOutlined,
  SvgIconComponent,
  TaskAltOutlined,
  Twitter,
  YouTube,
  RocketLaunchOutlined,
  FormatListNumberedOutlined,
  ChecklistRtlOutlined
} from '@mui/icons-material';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Grid3x3OutlinedIcon from '@mui/icons-material/Grid3x3Outlined';
import GridViewIcon from '@mui/icons-material/GridView';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListIcon from '@mui/icons-material/List';
import LockResetIcon from '@mui/icons-material/LockReset';
import LoginIcon from '@mui/icons-material/Login';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import RunningWithErrorsOutlinedIcon from '@mui/icons-material/RunningWithErrorsOutlined';
import ScreenLockRotationIcon from '@mui/icons-material/ScreenLockRotation';
import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
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
  }
];

export { APP_ICONS, type Icon };
