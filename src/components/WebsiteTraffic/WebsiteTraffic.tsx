'use clients';
import { JumboCard } from '@jumbo/components';
import { Typography } from '@mui/material';
import React from 'react';
import { ChartWebsiteTraffic } from './ChartWebsiteTraffic';

const WebsiteTraffic = ({ title }: { title: React.ReactNode }) => {
  return (
    <JumboCard
      title={
        <Typography variant={'h4'} mb={0}>
          {title}
        </Typography>
      }
      sx={{ textAlign: 'center' }}
    >
      <ChartWebsiteTraffic />
    </JumboCard>
  );
};

export { WebsiteTraffic };
