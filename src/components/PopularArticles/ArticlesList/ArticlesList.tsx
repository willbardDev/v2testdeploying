import List from '@mui/material/List';
import { ArticleItem } from '../ArticleItem';
import { popularArticles } from '../data';

const ArticlesList = () => {
  return (
    <List disablePadding>
      {popularArticles.map((item, index) => (
        <ArticleItem data={item} key={index} />
      ))}
    </List>
  );
};

export { ArticlesList };
