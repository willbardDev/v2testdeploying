'use client';
import { JumboCard } from '@jumbo/components';
import React from 'react';
import { TrafficAnalysisChart } from './TrafficAnalysisChart';

interface TrafficAnalysisProps {
  title: React.ReactNode;
  subheader: React.ReactNode;
}
const TrafficAnalysis = ({ title, subheader }: TrafficAnalysisProps) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      sx={{
        textAlign: 'center',
      }}
      contentWrapper
    >
      <TrafficAnalysisChart />
    </JumboCard>
  );
};

export { TrafficAnalysis };
