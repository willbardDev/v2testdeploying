import { getDictionary } from '@/app/[lang]/dictionaries';
import { BiaxialBarChart } from '@/components/charts/bar/BiaxialBarChart';
import { CustomShapeBarChart } from '@/components/charts/bar/CustomShapeBarChart';
import { MixBarChart } from '@/components/charts/bar/MixBarChart';
import { PositiveAndNegativeBarChart } from '@/components/charts/bar/PositiveAndNegativeBarChart';
import { StackedWithErrorBarChart } from '@/components/charts/bar/StackedWithErrorBarChart';
import { TinyBarChart } from '@/components/charts/bar/TinyBarChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { StackedBarChart } from '@mui/icons-material';
import { Container, Stack, Typography } from '@mui/material';

export default async function BarChart(props: Params) {
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
        {modules.title.barChart}
      </Typography>
      <Stack spacing={3}>
        <TinyBarChart />
        <StackedBarChart />
        <StackedWithErrorBarChart />
        <MixBarChart />
        <CustomShapeBarChart />
        <PositiveAndNegativeBarChart />
        <BiaxialBarChart />
      </Stack>
    </Container>
  );
}
