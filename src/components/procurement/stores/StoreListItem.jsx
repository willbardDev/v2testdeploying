import { Box, Grid, ListItemText, Tooltip, Typography } from '@mui/material'
import React from 'react'
import StoreItemAction from './StoreItemAction'
import { useNavigate } from 'react-router-dom';



const StoreListItem = ({store}) => {
  const navigate = useNavigate();
  return( 
    <Grid container 
    columnSpacing={1}
    sx={{
      cursor: 'pointer',
      borderTop: 1,
      borderColor: 'divider',
      '&:hover': {
          bgcolor: 'action.hover',
      },
      paddingLeft: 2,
  }}
  alignItems={'center'}
  >
    <Grid item xs={5}  lg={5}>
      <ListItemText
        primary={
          <Tooltip title="Name">
            <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0}>
            {store.name}
            </Typography>
          </Tooltip>
        }
        onClick={() => navigate(`/procurement/stores/${store.id}`)}
      />
    </Grid>
    <Grid item xs={4} lg={4}>
      <ListItemText
        primary={
          <Tooltip title="symbol">
            <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
              {store.alias}
            </Typography>
          </Tooltip>
        }
      />
    </Grid>
    <Grid item xs={3} lg={2}>
      <ListItemText
        primary={
          <Tooltip title="Description">
            <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
            {store.description}
            </Typography>
          </Tooltip>
        }
      />
    </Grid>
    <Grid item xs={12} lg={1}>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}> 
        <StoreItemAction store={store} />
        </Box>
    </Grid>
  </Grid>
  )
}

export default StoreListItem