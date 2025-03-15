import { List } from '@mui/material';
import { AuthorItem } from '../AuthorItem';
import { popularAuthors } from '../data';

export const AuthorsList = () => {
  return (
    <List disablePadding>
      {popularAuthors.map((item, index) => (
        <AuthorItem author={item} key={index} />
      ))}
    </List>
  );
};
