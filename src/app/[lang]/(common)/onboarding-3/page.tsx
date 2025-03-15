import { sidebarSteps, steps } from '@/components/onboarding/onboarding3/data';
import { Onboarding3Config } from '@/components/onboarding/onboarding3/Onboarding3Config';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';

export default function OnboardingPage3() {
  return (
    <OnboardingProvider initSteps={steps} initSidebarSteps={sidebarSteps}>
      <Onboarding3Config />
    </OnboardingProvider>
  );
}
