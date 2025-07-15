import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Box,
  ListItemText
} from '@mui/material';
import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RequisitionProductItemForm from './RequisitionProductItemForm';
import ProductVendor from './productVendor/ProductVendor';
import ProductVendorRow from './productVendor/ProductVendorRow';

function RequisitionProductItemRow({setClearFormKey, setIsDirty, currencyDetails, requisition_product_items, setRequisition_product_items, product_item, index }) {
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState(product_item?.vendors ? product_item.vendors.map(vendor => ({
    ...vendor,
    stakeholder_id: vendor.stakeholder_id ?  vendor.stakeholder_id : vendor.id
  })) : []);

  const handleChange = (currentIndex) => {
    setExpanded((prevExpanded) => (prevExpanded === currentIndex ? null : currentIndex));
  };

  const vat_factor = product_item.vat_percentage*0.01;
  const lineVat = product_item.product_item_vat ?  product_item.product_item_vat : (product_item.rate * vat_factor) || 0;
  const lineTotalAmount = product_item.amount ? product_item.amount : (product_item.rate* product_item.quantity * (1 + vat_factor));

  return (
    <Accordion
      key={index}
      expanded={expanded === index}
      onChange={() => handleChange(index)}
      square
      sx={{
        borderRadius: 2,
        borderTop: 2,
        padding: 0.5,
        borderColor: 'divider',
        '& > .MuiAccordionDetails-root:hover': {
          bgcolor: 'transparent',
        },
      }}
    >
      <AccordionSummary
        expandIcon={expanded === index ? <RemoveIcon /> : <AddIcon />}
        sx={{
          px: 3,
          flexDirection: 'row-reverse',
          '.MuiAccordionSummary-content': {
            alignItems: 'center',
            '&.Mui-expanded': {
              margin: '12px 0',
            },
          },
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
        <Divider />
        { !showForm ? (
          <Grid container 
            sx={{
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <Grid item xs={12} md={3.5}>
              <ListItemText
                primary={
                  <Tooltip title={'Product'}>
                    <Typography variant={"h5"} fontSize={14} lineHeight={1.25} mb={0} noWrap>
                      {product_item.product.name}
                    </Typography>
                  </Tooltip>
                }
                secondary={
                  <Tooltip title={'Remarks'}>
                    <Typography variant={"span"} fontSize={14} lineHeight={1.25} mb={0} >
                      {product_item.remarks}
                    </Typography>
                  </Tooltip>
                }
              />
            </Grid>
            <Grid textAlign={{md: 'end'}} item xs={6} md={2}>
              <Tooltip title="Quantity">
                <Typography>{product_item.quantity.toLocaleString()} {product_item?.unit_symbol ? product_item.unit_symbol : (product_item.measurement_unit?.symbol ? product_item.measurement_unit?.symbol : product_item.product.unit_symbol)}</Typography>
              </Tooltip>
            </Grid>
            <Grid textAlign={'end'} item xs={6} md={2}>
              <Tooltip title="Rate">
                <Typography>{product_item.rate?.toLocaleString()}</Typography>
              </Tooltip>
            </Grid>
            <Grid textAlign={{md: 'end'}} item xs={6} md={1.5} lg={1.5}>
              <Tooltip title="VAT">
                <Typography>{lineVat.toLocaleString()}</Typography>
              </Tooltip>
            </Grid>
            <Grid textAlign={'end'} item xs={6} md={2}>
              { product_item.rate && product_item.rate &&
                <Tooltip title="Amount">
                  <Typography>{lineTotalAmount?.toLocaleString('en-US', 
                    {
                      style: 'currency',
                      currency: currencyDetails?.code,
                    })}
                  </Typography>
                </Tooltip>
              }
            </Grid>
            <Grid textAlign={'end'} item xs={12} md={1}>
              <Tooltip title='Edit Item'>
                <IconButton size='small' onClick={() => {setShowForm(true)}}>
                  <EditOutlined fontSize='small'/>
                </IconButton>
              </Tooltip>
              <Tooltip title='Remove Item'>
                <IconButton size='small' 
                  onClick={() => setRequisition_product_items(items => {
                    const newItems = [...items];
                    newItems.splice(index,1);
                    return newItems;
                  })}
                >
                  <DisabledByDefault fontSize='small' color='error'/>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          ) : (
            <Box sx={{ width: '100%' }}>
             <RequisitionProductItemForm setClearFormKey={setClearFormKey} setIsDirty={setIsDirty} product_item={product_item} setShowForm={setShowForm} index={index} requisition_product_items={requisition_product_items} setRequisition_product_items={setRequisition_product_items} />
            </Box>
          )
        }
      </AccordionSummary>
      <AccordionDetails>
        <ProductVendor vendorIndex={index} setRequisition_product_items={setRequisition_product_items} product_item={product_item} vendors={vendors} setVendors={setVendors}/>
        
        {vendors.map((vendor,index) => (
          <ProductVendorRow key={index} index={index} vendor={vendor} vendors={vendors} setVendors={setVendors}/>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export default RequisitionProductItemRow;
