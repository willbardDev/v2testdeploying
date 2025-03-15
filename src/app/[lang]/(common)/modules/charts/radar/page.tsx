import { getDictionary } from '@/app/[lang]/dictionaries';
import { SimpleRadarChart } from '@/components/charts/radar/SimpleRadarChart';
import { SpecificDomainRadarChart } from '@/components/charts/radar/SpecificDomainRadarChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function RadarChart(props: Params) {
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
        {modules.title.radarChart}
      </Typography>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SimpleRadarChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SpecificDomainRadarChart />
        </Grid>
      </Grid>
    </Container>
  );
}
