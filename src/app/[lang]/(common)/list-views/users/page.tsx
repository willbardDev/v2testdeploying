import { getDictionary } from '@/app/[lang]/dictionaries';
import { UserListItem } from '@/components/UserListItem';
import { UserProps, users } from '@/components/UserListItem/data';
import { View } from '@/components/View';
import { CONTAINER_MAX_WIDTH } from '@/config/layouts';
import { Params } from '@/types/paramsType';
import { Container, Typography } from '@mui/material';

export default async function UsersList(props: Params) {
  const params = await props.params;
  const { lang } = params;
  const { views } = await getDictionary(lang);
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
      <Typography variant={'h2'} mb={3}>
        {views.title.users}
      </Typography>
      <View<UserProps>
        variant='list'
        dataSource={users}
        renderItem={UserListItem}
      />
    </Container>
  );
}
