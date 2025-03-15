import { getDictionary } from '@/app/[lang]/dictionaries';
import { Dnd } from '@/components/Dnd';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { JumboCard } from '@jumbo/components';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export default async function DnDPage(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const { extensions } = await getDictionary(lang);
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
        {extensions.title.dnd}
      </Typography>
      <JumboCard
        title={'Drag and drop'}
        contentWrapper
        contentSx={{
          p: 0,
          '&:last-child': {
            pb: 0,
          },
        }}
      >
        <Dnd />
      </JumboCard>
      {/* <DragAndDrop /> */}
    </Container>
  );
}
