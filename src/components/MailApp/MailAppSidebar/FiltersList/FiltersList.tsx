'use client';

import { StyledMenu } from '@/components/StyledMenu';
import { Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';
import { filtersOptions } from '../../data';
import { FilterItem } from './FilterItem';

const FiltersList = () => {
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
        Filter
      </Typography>
      <StyledMenu sx={{ mb: 2 }}>
        {filtersOptions.map((filter, index) => (
          <FilterItem
            key={index}
            slug={filter.slug}
            name={filter.name}
            icon={filter.icon}
            selected={Array.isArray(folder) && filter.slug === folder[0]}
          />
        ))}
      </StyledMenu>
    </React.Fragment>
  );
};

export { FiltersList };
