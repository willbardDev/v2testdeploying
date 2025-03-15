import { getDictionary } from '@/app/[lang]/dictionaries';
import { UserGridItem } from '@/components/UserGridItem';
import { UserProps, users } from '@/components/UserGridItem/data';
import { View } from '@/components/View';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';

export default async function UsersList(props: Params) {
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
          {views.title.users}
        </Typography>
        <View<UserProps>
          variant='grid'
          dataSource={users}
          renderItem={UserGridItem}
        />
      </Container>
    )
  );
}
