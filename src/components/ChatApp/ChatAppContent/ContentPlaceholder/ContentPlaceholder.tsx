import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';
import { Div } from '@jumbo/shared';
import { Typography } from '@mui/material';
import Image from 'next/image';

const ContentPlaceholder = () => {
  return (
    <Div
      sx={{
        textAlign: 'center',
        margin: 'auto',
        p: 3,
      }}
    >
      <Image
        src={getAssetPath(
          `${ASSET_IMAGES}/apps/undraw_development.svg`,
          '800x600'
        )}
        height={206}
        alt='404'
        width={380}
      />
      <Typography variant={'h2'} mt={2} color={'text.primary'}>
        Welcome to Jumbo chat app
      </Typography>
    </Div>
  );
};

export { ContentPlaceholder };
