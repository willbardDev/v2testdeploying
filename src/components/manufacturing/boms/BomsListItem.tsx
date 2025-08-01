'use client';

import React from 'react';
import {
  Divider,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import { BOM } from './BomsTypes';

interface BomsListItemProps {
  bom: BOM;
}

const BomsListItem: React.FC<BomsListItemProps> = ({ bom }) => {
  return (
    <React.Fragment>
      <Divider />
      <Grid
        mt={1}
        mb={1}
        container
        columnSpacing={1}
        alignItems="center"
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        px={2}
      >
        {/* Product Name */}
        <Grid size={{xs: 6, md: 6}}>
          <Tooltip title="Main Product">
            <Typography fontWeight="bold">
              {bom.product?.name ?? '—'}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Quantity and Measurement Unit */}
        <Grid size={{xs: 6, md: 6}}>
          <Tooltip title="Quantity & Unit">
            <Typography>
              {bom.quantity} {bom.measurement_unit?.name ?? ''}
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BomsListItem;
