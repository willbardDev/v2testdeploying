import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { Alert, Box, Grid, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import SecondaryUnitsItemAction from './SecondaryUnitsItemAction';
import productServices from '../../product-services';

function SecondaryUnits({expanded, product}) {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [openUnitDeleteDialog, setOpenUnitDeleteDialog] = useState(false);
  const [openUnitEditDialog, setOpenUnitEditDialog] = useState(false);

  const { data: secondaryUnits, isLoading } = useQuery(
    ['secondaryUnits', {id: product.id}],() => productServices.secondaryUnits(product.id),
    {
      enabled: !!expanded,
    }
  );

  return (
    <>
      {
        isLoading && <LinearProgress/>
      }
      {
        secondaryUnits?.length > 0 ? secondaryUnits.map((secondaryUnit) => (
        <Grid
          key={secondaryUnit.id}
            sx={{
              cursor: 'pointer',
              borderTop: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              paddingX: 1,
          }}
          columnSpacing={2}
          alignItems={'center'}
          mb={1}
          container
        >
          <Grid item xs={6} md={4} lg={4}>
            <Tooltip title={'Unit Name'}>
              <Typography>{secondaryUnit?.name}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <Tooltip title={'Symbol'}>
              <Typography variant='caption'>{secondaryUnit?.unit_symbol}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <Tooltip title={'Conversion Factor'}>
              <Typography>{secondaryUnit?.conversion_factor}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={2} lg={2}>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'flex-end'}
            >
              <Tooltip  title={`Edit ${secondaryUnit.name}`}>
                <IconButton 
                  onClick={() => {
                    setSelectedUnit(secondaryUnit);
                    setOpenUnitEditDialog(true);
                  }}
                >
                  <EditOutlined fontSize={'small'} />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Delete ${secondaryUnit.name}`}>
                <IconButton
                  onClick={() => {
                    setSelectedUnit(secondaryUnit);
                    setOpenUnitDeleteDialog(true);
                  }}
                >
                  <DeleteOutlined color="error"  fontSize={'small'} />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        ))
        :
        !isLoading && <Alert variant='outlined' color='primary' severity='info'>No Secondary Unit Found</Alert> 
      }

      {/* ItemAction*/}
      <SecondaryUnitsItemAction
        openUnitEditDialog={openUnitEditDialog}
        setOpenUnitEditDialog={setOpenUnitEditDialog}
        openUnitDeleteDialog={openUnitDeleteDialog}
        setOpenUnitDeleteDialog={setOpenUnitDeleteDialog} 
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        product={product}
      />
    </>      
  )
}

export default SecondaryUnits