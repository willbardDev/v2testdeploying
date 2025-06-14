import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, ListItemText, Tooltip, Typography } from '@mui/material'
import React, {useState} from 'react'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add'
import ProductItemAction from './ProductItemAction';
import ProductListItemTabs from './ProductListItemTabs';


function ProductListItem({product}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion
      expanded={expanded}
      square
      sx={{ 
        borderRadius: 2, 
        borderTop: 2,
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
      onChange={()=> setExpanded((prevExpanded) => !prevExpanded)}
    >
      <AccordionSummary
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
        sx={{
          px: 3,
          flexDirection: 'row-reverse',
          '.MuiAccordionSummary-content': {
            alignItems: 'center',
            '&.Mui-expanded': {
              margin: '12px 0',
            }},
          '.MuiAccordionSummary-expandIconWrapper': {
            borderRadius: 1,
            border: 1,
            color: 'text.secondary',  
            transform: 'none',
            mr: 1,
            '&.Mui-expanded': {
              transform: 'none',
              color: 'primary.main',
              borderColor: 'primary.main',
            },
            '& svg': {
              fontSize: '1.25rem',
            },
          },
        }}
      >
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
          <Grid item xs={12} md={5}>
            <ListItemText
              primary={
                <Tooltip title={'Name'}>
                  <Typography variant={"h5"} fontSize={14} mb={0}>
                    {product.name}
                  </Typography>
                </Tooltip>
              }
              secondary={
                <Tooltip title={'Item Type'}>
                  <Typography variant={"span"} fontSize={14} mb={0}
                    noWrap>{product.type}
                  </Typography>
                </Tooltip>
              }
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <ListItemText
              primary={
                <Tooltip title={'Primary Measurement unit'}>
                  <Typography variant={"span"} fontSize={14} mb={0} noWrap>
                    {`${product.measurement_unit.name} (${product.measurement_unit.symbol})`}
                  </Typography>
                </Tooltip>
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <ListItemText
              primary={
                <Tooltip title={'Category'}>
                  <Typography fontSize={14} mb={0}>
                    {product.category.name}
                  </Typography>
                </Tooltip>
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <ListItemText
              primary={
                <Tooltip title={'Description'}>
                  <Typography variant={"span"} mb={0}>
                    {product.description}
                  </Typography>
                </Tooltip>
              }
            />
          </Grid>
        </Grid>
        <Divider/>
      </AccordionSummary>
      <AccordionDetails
        sx={{ 
          backgroundColor:'background.paper',
          marginBottom: 3
        }}
      >
        <Grid container>
          <Grid item xs={12} textAlign={'end'}>
           <ProductItemAction product={product}/>
          </Grid>

          {/*Tab*/}
          { product.type === "Inventory" &&
            <ProductListItemTabs expanded={expanded} product={product}/>
          }
          
        </Grid>
      </AccordionDetails>
    </Accordion>

)
}

export default ProductListItem