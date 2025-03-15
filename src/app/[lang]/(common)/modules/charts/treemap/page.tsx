import { getDictionary } from '@/app/[lang]/dictionaries';
import { CustomContentTreemapChart } from '@/components/charts/treemap/CustomContentTreemapChart';
import { SimpleTreemapChart } from '@/components/charts/treemap/SimpleTreemapChart';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function TreeMapChart(props: Params) {
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
        {modules.title.treemapChart}
      </Typography>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SimpleTreemapChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomContentTreemapChart />
        </Grid>
      </Grid>
    </Container>
  );
}
