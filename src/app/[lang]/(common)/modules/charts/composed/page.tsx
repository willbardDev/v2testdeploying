import { getDictionary } from '@/app/[lang]/dictionaries';
import { AxisLabelsComposedChart } from '@/components/charts/composed/AxisLabelsComposedChart';
import { LineBarAreaComposedChart } from '@/components/charts/composed/LineBarAreaComposedChart';
import { SameDataComposedChart } from '@/components/charts/composed/SameDataComposedChart';
import { VerticalComposedChart } from '@/components/charts/composed/VerticalComposedChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Stack, Typography } from '@mui/material';
export default async function ComposedChart(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const { modules } = await getDictionary(lang);
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
      <Typography variant={'h1'} mb={3}>
        {modules.title.composedChart}
      </Typography>
      <Stack spacing={3}>
        <AxisLabelsComposedChart />
        <VerticalComposedChart />
        <SameDataComposedChart />
        <LineBarAreaComposedChart />
      </Stack>
    </Container>
  );
}
