
import React from 'react';
import {
  Divider,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import { BOM } from './BomsType';
import BomsListItemAction from './BomsListItemAction';

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
        <Grid size={{xs: 12, md: 4}}>
          <Tooltip title="Main Product">
            <Typography variant="subtitle1" fontSize={14} noWrap>
              {bom.product?.name ?? '—'}
            </Typography>
          </Tooltip>
        </Grid>

        {/* Quantity  */}
        <Grid size={{xs: 12, md: 6}}>
          <Tooltip title="Quantity & Unit">
            <Typography>
              {bom.quantity} 
            </Typography>
          </Tooltip>
        </Grid>
         {/* Actions */}
        <Grid size={{xs: 12, md: 2}}textAlign="end">
          <BomsListItemAction bom={bom} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BomsListItem;
