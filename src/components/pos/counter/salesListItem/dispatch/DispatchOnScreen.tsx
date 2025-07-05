import React from 'react';
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody 
} from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';
import { Organization, User } from '@/types/auth-types';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';

interface Product {
  name: string;
}

interface SaleItem {
  measurement_unit?: MeasurementUnit;
}

interface Store {
  name: string;
}

interface DeliveryItem {
  product: Product;
  sale_item: SaleItem;
  quantity: number;
  store: Store;
}

interface Delivery {
  deliveryNo: string;
  dispatch_date: string;
  creator: User;
  dispatch_from: string;
  destination: string;
  items: DeliveryItem[];
  vehicle_information?: string;
  driver_information?: string;
  remarks?: string;
}

interface DispatchOnScreenProps {
  delivery: Delivery;
  organization: Organization;
}

function DispatchOnScreen({ delivery, organization }: DispatchOnScreenProps) {
  const mainColor = organization.settings?.main_color || "#2113AD";
  const contrastText = organization.settings?.contrast_text || "#FFFFFF";
  const lightColor = organization.settings?.light_color || "#bec5da";

  return (
    <Box sx={{ padding: 1 }}>
      <Grid container spacing={1}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid size={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color={mainColor}>SALE DISPATCH</Typography>
            <Typography variant="subtitle1">{delivery.deliveryNo}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 0.5, marginBottom: 1 }}>
          <Grid size={6}>
            <Typography variant="body2" color={mainColor}>Dispatch Date</Typography>
            <Typography variant="body2">{readableDate(delivery.dispatch_date)}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color={mainColor}>Dispatched By</Typography>
            <Typography variant="body2">{delivery.creator.name}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color={mainColor}>From</Typography>
            <Typography variant="body2">{delivery.dispatch_from}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color={mainColor}>Destination</Typography>
            <Typography variant="body2">{delivery.destination}</Typography>
          </Grid>
        </Grid>

        <Grid size={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>S/N</TableCell>
                  <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Product/Service</TableCell>
                  <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Unit</TableCell>
                  <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Quantity</TableCell>
                  <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Store</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {delivery.items.map((deliveryItem, index) => (
                  <TableRow 
                    key={`${deliveryItem.product.name}-${index}`} 
                    sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{deliveryItem.product.name}</TableCell>
                    <TableCell>{deliveryItem.sale_item.measurement_unit?.symbol || '-'}</TableCell>
                    <TableCell align="right">{deliveryItem.quantity}</TableCell>
                    <TableCell>{deliveryItem.store.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={12} container spacing={2}>
          {delivery.vehicle_information && (
            <Grid size={6}>
              <Typography variant="subtitle2" color={mainColor}>Vehicle Information</Typography>
              <Typography variant="body2">{delivery.vehicle_information}</Typography>
            </Grid>
          )}
          {delivery.driver_information && (
            <Grid size={6}>
              <Typography variant="subtitle2" color={mainColor}>Driver Information</Typography>
              <Typography variant="body2">{delivery.driver_information}</Typography>
            </Grid>
          )}
          {delivery.remarks && (
            <Grid size={12}>
              <Typography variant="subtitle2" color={mainColor}>Remarks</Typography>
              <Typography variant="body2">{delivery.remarks}</Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DispatchOnScreen;