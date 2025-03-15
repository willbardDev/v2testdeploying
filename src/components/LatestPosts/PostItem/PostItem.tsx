import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { PostItemType } from '../data';

const PostItem = ({ post }: { post: PostItemType }) => {
  return (
    <ListItem sx={{ p: (theme) => theme.spacing(1, 3) }}>
      <ListItemAvatar
        sx={{ mr: 2, width: 120, overflow: 'hidden', borderRadius: 2 }}
      >
        <Image
          width={120}
          height={84}
          alt={''}
          style={{ verticalAlign: 'middle' }}
          src={post.image}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant='h5' mb={0.25}>
            {post.title}
          </Typography>
        }
        secondary={
          <Typography component={'div'}>
            <Typography
              color={'text.secondary'}
              variant='body1'
              fontSize={12}
              mb={1}
            >
              {post.date}
            </Typography>
            <Typography noWrap variant='body1'>
              {post.description}
            </Typography>
          </Typography>
        }
      />
    </ListItem>
  );
};

export { PostItem };
