'use client';
import { ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useRouter } from 'next/navigation';
import { UserProps } from '../../data';

const ContactItem = ({ contactItem }: { contactItem: UserProps }) => {
  const router = useRouter(); // Use useRouter hook from Next.js
  const handleContactClick = () => {
    router.push(`/apps/chat/contact/${contactItem?.id}`); // Use router.push for navigation
  };

  return (
    <List disablePadding>
      <ListItemButton component='li' onClick={handleContactClick}>
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
                  contactItem.status === 'offline'
                    ? '#a89f9f'
                    : contactItem.status === 'online'
                      ? '#72d63a'
                      : '#F7BB07',
              },
            }}
          >
            <Avatar alt={contactItem.name} src={contactItem.profile_pic} />
          </Badge>
        </ListItemAvatar>
        <ListItemText
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
              <Typography variant='h6' mb={0}>
                {contactItem.name}
              </Typography>
            </Typography>
          }
        />
      </ListItemButton>
      <Divider component='li' />
    </List>
  );
};

export { ContactItem };
