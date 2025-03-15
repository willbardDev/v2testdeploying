'use client';
import { JumboCard } from '@jumbo/components';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { NewRequestsList } from './NewRequestsList';
import { requests } from './data';
type NewRequestsProps = {
  title: React.ReactNode;
  subheader: React.ReactNode;
};
const NewRequests = ({ title, subheader }: NewRequestsProps) => {
  const [refreshRequests, setRefreshRequests] = React.useState<boolean>(false);

  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={
        <IconButton onClick={() => setRefreshRequests(true)}>
          <AutorenewIcon />
        </IconButton>
      }
      contentWrapper
      contentSx={{ p: 0 }}
    >
      <NewRequestsList
        refresh={refreshRequests}
        requests={requests}
        onRefreshCallback={setRefreshRequests}
      />
    </JumboCard>
  );
};

export { NewRequests };
