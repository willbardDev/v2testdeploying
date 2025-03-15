import { getDictionary } from '@/app/[lang]/dictionaries';
import { SimpleRadialChart } from '@/components/charts/radial/SimpleRadialChart';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';

export default async function RadialChart(props: Params) {
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
        {modules.title.radialChart}
      </Typography>
      <SimpleRadialChart />
    </Container>
  );
}
