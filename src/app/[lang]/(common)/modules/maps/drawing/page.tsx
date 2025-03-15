import { getDictionary } from '@/app/[lang]/dictionaries';
import { DrawingViewMap } from '@/components/maps/DrawingViewMap';
import { MapProvider } from '@/components/maps/MapProvider';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
export default async function DrawingView(props: Params) {
  const params = await props.params;
  const { lang } = params;

  const { modules } = await getDictionary(lang);

  return (
    <MapProvider>
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
          {modules.title.drawingViewMap}
        </Typography>
        <DrawingViewMap />
      </Container>
    </MapProvider>
  );
}
