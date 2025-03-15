import { getDictionary } from '@/app/[lang]/dictionaries';
import { ProjectGridItem } from '@/components/ProjectGridItem';
import { projects, ProjectType } from '@/components/ProjectGridItem/data';
import { users } from '@/components/UserGridItem/data';
import { View } from '@/components/View';

import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';

export default async function ProjectsList(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const { views } = await getDictionary(lang);
  return (
    users.length > 0 && (
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
        <Typography variant={'h2'} mb={3}>
          {views.title.projects}
        </Typography>
        <View<ProjectType>
          variant='grid'
          dataSource={projects}
          renderItem={ProjectGridItem}
        />
      </Container>
    )
  );
}
