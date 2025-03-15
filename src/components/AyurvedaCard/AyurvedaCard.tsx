import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { JumboCardFeatured } from '@jumbo/components';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

function AyurvedaCard({ height }: { height: number }) {
  return (
    <JumboCardFeatured
      separatorSx={{ bgcolor: 'success.main' }}
      direction={'column'}
      contentWrapperProps={{ textAlign: 'center' }}
      fitToWidth={true}
      image={
        <Image
          src={`${ASSET_IMAGES}/dashboard/ayurveda.jpg`}
          width={600}
          height={300}
          alt='Ayurveda'
        />
      }
    >
      <Typography variant={'h4'} mb={2}>
        Ayurveda
      </Typography>
      <Typography mb={3}>
        Learn with experts from around the world. Some description about the
        card can be found below.
      </Typography>
      <Button variant={'contained'}>Learn More</Button>
    </JumboCardFeatured>
  );
}

export { AyurvedaCard };
