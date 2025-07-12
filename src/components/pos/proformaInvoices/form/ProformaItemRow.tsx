import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import ProformaItemForm from './ProformaItemForm';
import { Product, ProductOption } from '@/components/productAndServices/products/ProductType';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';

interface ProformaItem {
    product_id?: number;
    product?: Product;
    quantity: number;
    rate: number;
    measurement_unit_id?: number;
    measurement_unit?: MeasurementUnit;
    unit_symbol?: string;
    store_id?: number;
    amount?: number;
    vat_amount?: number;
}

interface ProformaItemRowProps {
  setClearFormKey: React.Dispatch<React.SetStateAction<number>>;
  submitMainForm: () => void;
  setSubmitItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  submitItemForm: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  items: ProformaItem[];
  setItems: React.Dispatch<React.SetStateAction<ProformaItem[]>>;
  item: ProformaItem;
  index: number;
  vat_percentage?: number;
}

function ProformaItemRow({
  setClearFormKey,
  submitMainForm,
  setSubmitItemForm,
  submitItemForm,
  setIsDirty,
  items,
  setItems,
  item,
  index,
  vat_percentage = 0,
}: ProformaItemRowProps) {
  const product = item.product;
  const [showForm, setShowForm] = useState(false);
  const vat_factor = vat_percentage * 0.01;

  const calculateLineTotal = (): number => {
    return item.quantity * item.rate * (1 + (product?.vat_exempted ? 0 : vat_factor));
  };

  const calculateVatAmount = (): number => {
    return product?.vat_exempted ? 0 : item.rate * vat_factor;
  };

  const handleRemoveItem = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  return (
    <>
      <Divider />
      {!showForm ? (
        <Grid
          container
          sx={{
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
            alignItems: 'center',
            py: 1,
          }}
        >
          <Grid size={{ xs: 1, md: 0.5, lg: 0.5 }}>
            <Typography variant="body2">{index + 1}.</Typography>
          </Grid>

          <Grid size={{ xs: 11, md: 4.5, lg: 4.5 }}>
            <Tooltip title="Product">
              <Typography noWrap>{product?.name}</Typography>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: vat_factor ? 4 : 6, md: 2.5, lg: vat_factor ? 1 : 2 }}>
            <Tooltip title="Quantity">
              <Typography textAlign={{ md: 'end' }} variant="body2">
                {item.quantity.toLocaleString()} {item?.unit_symbol ? item.unit_symbol : (item.measurement_unit?.symbol ? item.measurement_unit?.symbol : item?.product?.unit_symbol)}
              </Typography>
            </Tooltip>
          </Grid>

          <Grid size={{ xs: vat_factor ? 4 : 6, md: 2.5, lg: vat_factor ? 1 : 1.5 }}>
            <Tooltip title="Price">
              <Typography textAlign="end" variant="body2">
                {item.rate.toLocaleString()}
              </Typography>
            </Tooltip>
          </Grid>

          {vat_factor > 0 && (
            <Grid size={{ xs: 4, md: 2, lg: 2 }}>
              <Tooltip title="VAT">
                <Typography textAlign="end" variant="body2">
                  {calculateVatAmount().toLocaleString()}
                </Typography>
              </Tooltip>
            </Grid>
          )}

          <Grid size={{ xs: 6, md: 2 }}>
            <Tooltip title="Line Total">
              <Typography textAlign={{ md: 'end' }} variant="body2">
                {calculateLineTotal().toLocaleString()}
              </Typography>
            </Tooltip>
          </Grid>

          <Grid textAlign={'end'} size={{ xs: 12, md: 12, lg: 1 }}>
            <Tooltip title="Edit Item">
              <IconButton size="small" onClick={() => setShowForm(true)}>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove Item">
              <IconButton size="small" onClick={handleRemoveItem}>
                <DisabledByDefault fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ) : (
        <ProformaItemForm
          setClearFormKey={setClearFormKey}
          submitMainForm={submitMainForm}
          setSubmitItemForm={setSubmitItemForm}
          submitItemForm={submitItemForm}
          setIsDirty={setIsDirty}
          item={item}
          vat_percentage={vat_percentage}
          setShowForm={setShowForm}
          index={index}
          items={items}
          setItems={setItems}
        />
      )}
    </>
  );
}

export default ProformaItemRow;