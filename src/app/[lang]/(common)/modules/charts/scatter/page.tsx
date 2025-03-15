import { getDictionary } from '@/app/[lang]/dictionaries';
import { JointScatterChart } from '@/components/charts/scatter/JointScatterChart';
import { MultipleYAxesScatterChart } from '@/components/charts/scatter/MultipleYAxesScatterChart';
import { SimpleScatterChart } from '@/components/charts/scatter/SimpleScatterChart';
import { ThreeDimensionalScatterChart } from '@/components/charts/scatter/ThreeDimensionalScatterChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function ScatterChart(props: Params) {
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
        {modules.title.scatterChart}
      </Typography>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SimpleScatterChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <JointScatterChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ThreeDimensionalScatterChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MultipleYAxesScatterChart />
        </Grid>
      </Grid>
    </Container>
  );
}
