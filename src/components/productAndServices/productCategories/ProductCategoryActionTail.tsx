import { AddOutlined } from '@mui/icons-material'
import { Dialog, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import React, { useContext, useState } from 'react'
import ProductCategoryFormDialogContent from './ProductCategoryFormDialogContent';
import { ProductCategoriesAppContext } from './ProductCategories';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';

const ProductCategoryActionTail = () => {
  const {productCategories} = useContext(ProductCategoriesAppContext);
  const [newProductCategoryFormOpen, setNewProductCategoryFormOpen] = useState(false);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
    
  return (
    <React.Fragment>
      <Tooltip title={'New Product Category'}>
        <IconButton size='small' onClick={() => setNewProductCategoryFormOpen(true)}>
          <AddOutlined/>
        </IconButton>
      </Tooltip>
      <Dialog
        open={newProductCategoryFormOpen}
        scroll={'paper'}
        fullWidth
        fullScreen={belowLargeScreen} 
      >
        <ProductCategoryFormDialogContent
          onClose={() => setNewProductCategoryFormOpen(false)}
          toggleOpen={setNewProductCategoryFormOpen} 
          productCategories={!!productCategories && productCategories}
        />
      </Dialog>
    </React.Fragment>
  )
}

export default ProductCategoryActionTail