import React, { createContext, useContext } from 'react';
import { Organization } from '@/types/auth-types';
import { Dayjs } from 'dayjs';
import { AdditionalFeature, Module, Subscription } from './SubscriptionsForm';

interface SubscriptionFormContextProps {
  subscription?: Subscription;
  totalAdditionalFeaturesMonthlyCost: number;
  totalModulesMonthly: number;
  setTotalAdditionalFeaturesAmount: (value: number) => void;
  totalAdditionalFeaturesAmount: number;
  additionalFeaturesSelected: AdditionalFeature[];
  setAdditionalFeaturesSelected: (features: AdditionalFeature[]) => void;
  Modules?: Module[];
  organization?: Organization;
  start_date: Dayjs | Date;
  userIsProsAfrican: boolean;
  modulesSelected: Module[];
  setModulesSelected: (modules: Module[]) => void;
  moduleValues: Module[];
  setModuleValues: (modules: Module[]) => void;
  additionalFeatureValues: Record<string, any>;
  setAdditionalFeatureValues: (values: Record<string, any>) => void;
}

const SubscriptionFormContext = createContext<SubscriptionFormContextProps | undefined>(undefined);

export const SubscriptionFormProvider: React.FC<{
  value: SubscriptionFormContextProps;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <SubscriptionFormContext.Provider value={value}>
      {children}
    </SubscriptionFormContext.Provider>
  );
};

export const useSubscriptionFormContext = () => {
  const context = useContext(SubscriptionFormContext);
  if (!context) {
    throw new Error('useSubscriptionFormContext must be used within a SubscriptionFormProvider');
  }
  return context;
};