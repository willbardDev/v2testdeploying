import { getDictionary } from '@/app/[lang]/dictionaries';
import { KmlLayerMap } from '@/components/maps/KmlLayerMap';
import { MapProvider } from '@/components/maps/MapProvider';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export default async function KmLayer(props: Params) {
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
          {modules.title.kmlLayerMap}
        </Typography>
        <KmlLayerMap />
      </Container>
    </MapProvider>
  );
}
