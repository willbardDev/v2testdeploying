import { ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useRouter } from 'next/navigation';

const ConversationItem = ({ conversationItem }: any) => {
  const router = useRouter();
  const handleConversationClick = () => {
    return router.push(`/apps/chat/conversation/${conversationItem?.id}`);
  };
  return (
    <List disablePadding>
      <ListItemButton component='li'>
        <ListItemAvatar>
          <Badge
            overlap='circular'
            variant='dot'
            sx={{
              '& .MuiBadge-badge': {
                height: 10,
                width: 10,
                border: 1,
                borderColor: 'common.white',
                borderRadius: '50%',
                backgroundColor:
                  conversationItem?.contact?.status === 'offline'
                    ? '#a89f9f'
                    : conversationItem?.contact?.status === 'online'
                      ? '#72d63a'
                      : '#F7BB07',
              },
            }}
          >
            <Avatar
              alt={conversationItem?.contact?.name}
              src={conversationItem?.contact?.profile_pic}
            />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          onClick={handleConversationClick}
          primary={
            <Typography
              component='div'
              variant='body1'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='h6' mb={0.5} fontSize={15}>
                {conversationItem?.contact?.name}
              </Typography>
            </Typography>
          }
          secondary={
            <Typography
              component='div'
              variant='body1'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                noWrap
                variant='body1'
                color={'text.secondary'}
                fontSize={13}
              >
                {conversationItem?.last_message?.message}
              </Typography>
            </Typography>
          }
        />
      </ListItemButton>
      <Divider component='li' />
    </List>
  );
};
export { ConversationItem };
