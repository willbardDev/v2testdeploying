import { Div } from '@jumbo/shared';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ImageList, ImageListItem, Link, Typography } from '@mui/material';
import Image from 'next/image';
import { itemData } from '../data';

const SocialPhotos = () => {
  return (
    <Div sx={{ mb: 1 }}>
      <Typography variant={'h4'} mb={2}>
        Photos
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
        {itemData.map((item, index) => (
          <ImageListItem key={index}>
            <Image
              width={72}
              height={50}
              src={item.profilePic}
              alt={item.title}
              loading='lazy'
              className='MuiImageListItem-img'
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Div>
        <Link href='#' underline='none'>
          Go to gallery <ArrowForwardIcon sx={{ verticalAlign: 'middle' }} />
        </Link>
      </Div>
    </Div>
  );
};

export { SocialPhotos };
