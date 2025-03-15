import { getDictionary } from '@/app/[lang]/dictionaries';
import { ConnectNullAreaChart } from '@/components/charts/area/ConnectNullAreaChart';
import { PercentAreaChart } from '@/components/charts/area/PercentAreaChart';
import { SimpleAreaChart } from '@/components/charts/area/SimpleAreaChart';
import { StackedAreaChart } from '@/components/charts/area/StackedAreaChart';
import { SynchronizedAreaChart } from '@/components/charts/area/SynchronizedAreaChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Stack, Typography } from '@mui/material';

export default async function ChartArea(props: Params) {
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
        {modules.title.areaChart}
      </Typography>
      <Stack spacing={3}>
        <SimpleAreaChart />
        <StackedAreaChart />
        <ConnectNullAreaChart />
        <SynchronizedAreaChart />
        <PercentAreaChart />
      </Stack>
    </Container>
  );
}
