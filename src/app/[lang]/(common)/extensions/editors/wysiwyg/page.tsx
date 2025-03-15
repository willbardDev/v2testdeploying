import { getDictionary } from '@/app/[lang]/dictionaries';
import { TipTapWysiwygEditor } from '@/components/TipTapWysiwygEditor';
// import { WysiwygEditor } from '@/_components/extensions/editors/wysiwyg';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';

export default async function WysiwygEditorPage(props: Params) {
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
        {extensions.title.wysiwygEditor}
      </Typography>
      <TipTapWysiwygEditor />
      {/* <WysiwygEditor /> */}
    </Container>
  );
}
