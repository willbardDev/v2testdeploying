import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { Div, Link } from '@jumbo/shared';
import { Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
const PaymentDetailSidebar = () => {
  return (
    <React.Fragment>
      <Div>
        <Typography mb={2} variant='h2'>
          Create your toolbox 3
        </Typography>
        <Image
          width={245}
          height={235}
          src={`${ASSET_IMAGES}/toolbox-1.png`}
          alt=''
        />
      </Div>
      <Typography variant='h6' mb={2}>
        Tips about payment methods
      </Typography>
      <Typography variant='body1' mb={2}>
        All of these payment methods will be available throughout the checkout
        process you use.
      </Typography>

      <Typography variant='body1' mb={2}>
        To receive payments, you need to add payment methods under{' '}
        <Link href={'#'}>{'Settings > Payment'}</Link> Methods.
      </Typography>
    </React.Fragment>
  );
};

export { PaymentDetailSidebar };
