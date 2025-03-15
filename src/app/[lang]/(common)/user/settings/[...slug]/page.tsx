'use client';

import { ActiveLogin } from '@/components/settings/ActiveLogin';
import { AdvertisingSettings } from '@/components/settings/AdvertisingSettings';
import { EmailAccessSettings } from '@/components/settings/EmailAccessSettings';
import { InvoiceSettings } from '@/components/settings/InvoiceSettings';
import { MembershipPlans } from '@/components/settings/MembershipPlans';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { OrganizationSettings } from '@/components/settings/OrganizationSettings';
import { PaymentMethodSettings } from '@/components/settings/PaymentMethodSettings';
import { ResetPasswordSettings } from '@/components/settings/ResetPasswordSettings';
import { StatementSettings } from '@/components/settings/StatementSettings';
import { TeamSettings } from '@/components/settings/TeamSettings';
import { TwoFactorAuth } from '@/components/settings/TwoFactorAuth';
import { use } from 'react';

const options: any = {
  team: TeamSettings,
  'login-devices': ActiveLogin,
  organizations: OrganizationSettings,
  emails: EmailAccessSettings,
  'reset-password': ResetPasswordSettings,
  '2-factor-auth': TwoFactorAuth,
  'membership-plans': MembershipPlans,
  'payment-methods': PaymentMethodSettings,
  invoices: InvoiceSettings,
  statements: StatementSettings,
  advertising: AdvertisingSettings,
  notifications: NotificationSettings,
};
type Params = { slug: string };

const SettingLayoutOptions = (props: { params: Promise<Params> }) => {
  const params = use(props.params);
  const { slug } = params;
  const SettingComponent = options[slug];
  return <SettingComponent />;
};

export default SettingLayoutOptions;
