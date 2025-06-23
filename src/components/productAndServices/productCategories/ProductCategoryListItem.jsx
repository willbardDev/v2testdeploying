import { Divider, Grid, Tooltip, Typography } from '@mui/material'
import React from 'react'
import ProductCategoryItemAction from './ProductCategoryItemAction'

const ProductCategoryListItem = ({productCategory}) => {
  return (
    <React.Fragment>
      <Divider/>      
      <Grid
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
        <Grid size={{xs: 6, md: 4}}>
          <Tooltip title='Category Name'>
            <Typography variant="h5" fontSize={14} lineHeight={1.25} mb={0} noWrap>
              {productCategory.name}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid size={{xs: 6, md: 4}}>
          <Tooltip title='Parent Category'>
            <Typography>{productCategory.parent?.name}</Typography>
          </Tooltip>
        </Grid>
        <Grid size={{xs: 6, md: 3}}>
          <Tooltip title='Description'>
            <Typography>{productCategory.description}</Typography>
          </Tooltip>
        </Grid>
        <Grid size={{xs: 6, md: 1}}textAlign={"end"}>
          <ProductCategoryItemAction productCategory={productCategory} />
        </Grid> 
      </Grid>
    </React.Fragment>
  )
}

export default ProductCategoryListItem