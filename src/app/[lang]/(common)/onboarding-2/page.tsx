import { steps } from '@/components/onboarding/onboarding2/data';
import { Onboarding2Config } from '@/components/onboarding/onboarding2/Onboarding2Config';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Container } from '@mui/material';

export default function Onboarding2Page() {
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <OnboardingProvider initSteps={steps}>
        <Onboarding2Config />
      </OnboardingProvider>
    </Container>
  );
}
