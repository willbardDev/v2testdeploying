'use client';
import { CreditScoreChart } from '@/components/CreditScoreChart';
import { Typography } from '@mui/material';
import React from 'react';

const ChartWebsiteTraffic = () => {
  return (
    <React.Fragment>
      <CreditScoreChart
        score={30}
        color='red'
        startAngle={-120}
        endAngle={120}
      />
      <Typography variant={'h5'}>2,855 users online</Typography>
      <Typography variant={'body1'} mb={2}>
        Moderate level
      </Typography>
    </React.Fragment>
  );
};

export { ChartWebsiteTraffic };
