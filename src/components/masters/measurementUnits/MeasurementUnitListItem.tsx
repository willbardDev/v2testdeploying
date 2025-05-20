import React from 'react';
import {Divider,Grid, Tooltip, Typography } from '@mui/material';
import MeasurementUnitItemAction from './MeasurementUnitItemAction';
import { MeasurementUnit } from './MeasurementUnitType';

const measurementUnitListItem = ({ measurementUnit }:{measurementUnit: MeasurementUnit}) => {
  return (
    <React.Fragment>
        <Divider/>
        <Grid mt={1} mb={1}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.hover',
                }
            }}  
            paddingLeft={2}
            paddingRight={2}
            columnSpacing={1}
            alignItems={'center'}
            container
        >
            <Grid size={{xs: 12, md: 5}}>
              <Tooltip title='Name'>
                <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
                  {measurementUnit.name}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Tooltip title='Symbol'>
                <Typography>{measurementUnit.symbol}</Typography>
              </Tooltip>
            </Grid>
            <Grid size={{xs: 12, md: 3}}>
              <Tooltip title='Description'>
                <Typography>{measurementUnit.description}</Typography>
              </Tooltip>
            </Grid>
            <Grid size={{xs: 1, md: 0.5, lg: 1}} textAlign={"end"}>
              <MeasurementUnitItemAction measurementUnit={measurementUnit}/>
            </Grid> 
        </Grid>
    </React.Fragment>
  );
};

export default measurementUnitListItem;