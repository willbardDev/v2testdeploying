'use client';
import { PersonalDetail } from '../PaymentDetail';

export const steps: any = [
  {
    key: 'personal-detail',
    component: PersonalDetail,
  },
  {
    key: 'about-organisation',
    component: PersonalDetail,
  },
  {
    key: 'payment-detail',
    component: PersonalDetail,
  },
  {
    key: 'billing-address',
    component: PersonalDetail,
  },
  {
    key: 'final-onboarding',
    component: PersonalDetail,
  },
];
