import { getDictionary } from '@/app/[lang]/dictionaries';
import { CkEditor } from '@/components/CkEditor';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';

export default async function CkEditorPage(props: Params) {
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
      <Typography variant={'h1'} sx={{ mb: 3 }}>
        {extensions.title.ckEditor}
      </Typography>
      <CkEditor />
    </Container>
  );
}
