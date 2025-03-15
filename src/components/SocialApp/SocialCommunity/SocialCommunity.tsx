import { Div } from '@jumbo/shared';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { itemData } from '../data';

const SocialCommunity = () => {
  return (
    <Div sx={{ mb: 4 }}>
      <Typography variant={'h4'} mb={2}>
        Community
      </Typography>
      <ImageList
        cols={3}
        rowHeight={'auto'}
        sx={{
          m: 0,
          mb: 2,
          width: '100%',
          borderRadius: 3,
        }}
      >
        {itemData.map((item) => (
          <ImageListItem key={item.profilePic}>
            <Image
              src={`${item.profilePic}?w=120&h=120&fit=crop&auto=format`}
              objectFit='crop'
              width={120}
              height={120}
              alt={item.title}
              loading='lazy'
              className='MuiImageListItem-img'
            />
            <ImageListItemBar
              title={item.title}
              sx={{
                '& .MuiImageListItemBar-titleWrap': {
                  p: (theme) => theme.spacing(0.5, 1.5),
                },

                '& .MuiImageListItemBar-title': {
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                },
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Div>
        <Link href='#' underline='none'>
          See all communities
          <ArrowForwardIcon sx={{ verticalAlign: 'middle' }} />
        </Link>
      </Div>
    </Div>
  );
};

export { SocialCommunity };
