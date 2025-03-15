import { steps } from '@/components/onboarding/onboarding1/data';
import { Onboarding1Config } from '@/components/onboarding/onboarding1/OnboardingConfig';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';

export default function Onboarding1Page() {
  return (
    <OnboardingProvider initSteps={steps}>
      <Onboarding1Config />
    </OnboardingProvider>
  );
}
