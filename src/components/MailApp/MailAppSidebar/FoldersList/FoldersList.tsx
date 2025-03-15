'use client';

import { StyledMenu } from '@/components/StyledMenu';
import { Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';
import { foldersList } from '../../data';
import { FolderItem } from './FolderItem';

const FoldersList = () => {
  const { folder } = useParams();
  return (
    <React.Fragment>
      <Typography
        variant={'h6'}
        color={'text.secondary'}
        sx={{
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '11px',
        }}
      >
        Folder
      </Typography>
      <StyledMenu sx={{ mb: 2 }}>
        {foldersList.map((item, index) => (
          <FolderItem
            key={index}
            slug={item.slug}
            name={item.name}
            icon={item.icon}
            selected={Array.isArray(folder) && item.slug === folder[0]}
          />
        ))}
      </StyledMenu>
    </React.Fragment>
  );
};

export { FoldersList };
