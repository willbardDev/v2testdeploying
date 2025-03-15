import { getDictionary } from '@/app/[lang]/dictionaries';
import { MapProvider } from '@/components/maps/MapProvider';
import { PopupInfoMap } from '@/components/maps/PopupInfoMap';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export default async function PopupInfo(props: Params) {
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
          {modules.title.popupInfoMap}
        </Typography>
        <PopupInfoMap />
      </Container>
    </MapProvider>
  );
}
