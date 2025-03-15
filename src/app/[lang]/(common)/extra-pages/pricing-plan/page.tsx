import { getDictionary } from '@/app/[lang]/dictionaries';
import { PricingPlan } from '@/components/PricingPlan';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';

export default async function PricingPlanPage(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const { extraPages } = await getDictionary(lang);
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
      <Typography variant={'h2'} mb={4}>
        {extraPages.title.pricePlan}
      </Typography>
      <PricingPlan />
    </Container>
  );
}
