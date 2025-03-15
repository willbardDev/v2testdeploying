import { getDictionary } from '@/app/[lang]/dictionaries';
import { DzBasic } from '@/components/dropzone/DzBasic';
import { DzDisabled } from '@/components/dropzone/DzDisabled';
import { DzPreviews } from '@/components/dropzone/DzPreviews';
import { DzStyled } from '@/components/dropzone/DzStyled';
import { DzWithoutClick } from '@/components/dropzone/DzWithoutClick';
import { DzWithoutDrag } from '@/components/dropzone/DzWithoutDrag';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default async function Dropzone(props: Params) {
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
        {extensions.title.dropzone}
      </Typography>
      <Stack spacing={3}>
        <DzBasic />
        <DzPreviews />
        <DzStyled />
        <DzWithoutClick />
        <DzWithoutDrag />
        <DzDisabled />
      </Stack>
    </Container>
  );
}
