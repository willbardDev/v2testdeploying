import List from '@mui/material/List';
import { CommentItem } from '../CommentItem';
import { commentsList } from '../data';

const CommentsList = () => {
  return (
    <List disablePadding>
      {commentsList.map((item, index) => (
        <CommentItem item={item} key={index} />
      ))}
    </List>
  );
};

export { CommentsList };
