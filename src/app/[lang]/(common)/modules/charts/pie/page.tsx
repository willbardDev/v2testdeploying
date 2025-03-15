import { getDictionary } from '@/app/[lang]/dictionaries';
import { CustomActiveShapePieChart } from '@/components/charts/pie/CustomActiveShapePieChart';
import { CustomizedLabelPieChart } from '@/components/charts/pie/CustomLabelPieChart';
import { PaddingAnglePieChart } from '@/components/charts/pie/PaddingAnglePieChart';
import { SimplePieChart } from '@/components/charts/pie/SimplePieChart';
import { StraightAnglePieChart } from '@/components/charts/pie/StraightAnglePieChart';
import { TwoLevelPieChart } from '@/components/charts/pie/TwoLevelPieChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function PieChart(props: Params) {
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
        {modules.title.pieChart}
      </Typography>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TwoLevelPieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StraightAnglePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomActiveShapePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomizedLabelPieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SimplePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaddingAnglePieChart />
        </Grid>
      </Grid>
    </Container>
  );
}
