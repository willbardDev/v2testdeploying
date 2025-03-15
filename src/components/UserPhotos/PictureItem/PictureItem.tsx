import { ImageListItemBar } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image';
import { UserPhotoType } from '../data';

const PictureItem = ({ item }: { item: UserPhotoType }) => {
  return (
    <ImageListItem
      key={item.photo_url}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',

        '& .MuiImageListItemBar-root': {
          transition: 'all 0.3s ease',
          transform: 'translateY(100%)',
        },

        '&:hover .MuiImageListItemBar-root': {
          transform: 'translateY(0)',
        },
      }}
    >
      <Image
        src={`${item.photo_url}?w=280&fit=crop&auto=format`}
        alt={item.caption}
        width={280}
        height={260}
        loading='lazy'
        style={{
          aspectRatio: '1/1',
        }}
        className='MuiImageListItem-img'
      />
      <ImageListItemBar title={item.caption} subtitle={item.size} />
    </ImageListItem>
  );
};

export { PictureItem };
