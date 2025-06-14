import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from '@mui/material';
import { readableDate } from 'app/helpers/input-sanitization-helpers';

function StockAdjustmentOnScreen({ stockAdjustment, authObject }) {
  const { authOrganization: { organization } } = authObject;
  const theme = useTheme();

  const mainColor = organization.settings?.main_color || theme.palette.primary.main;
  const lightColor = organization.settings?.light_color || theme.palette.action.hover;
  const contrastText = organization.settings?.contrast_text || theme.palette.common.white;

  const totalValueChange = stockAdjustment.inventory_movements.reduce(
    (sum, m) => sum + m.rate * m.stock_change,
    0
  );

  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h6" sx={{ color: mainColor }}>STOCK ADJUSTMENT</Typography>
          <Typography variant="subtitle1">{stockAdjustment.adjustmentNo}</Typography>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color={mainColor}>Adjustment Date</Typography>
          <Typography>{readableDate(stockAdjustment.adjustment_date)}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color={mainColor}>Store</Typography>
          <Typography>{stockAdjustment.store.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color={mainColor}>Cost Center</Typography>
          <Typography>{stockAdjustment.cost_center.name}</Typography>
        </Grid>
      </Grid>

      {/* Table Section */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: mainColor }}>
              <TableCell sx={{ color: contrastText }}>S/N</TableCell>
              <TableCell sx={{ color: contrastText }}>Product</TableCell>
              <TableCell sx={{ color: contrastText }}>Unit</TableCell>
              <TableCell sx={{ color: contrastText }}>Qty Before</TableCell>
              <TableCell sx={{ color: contrastText }}>Qty After</TableCell>
              <TableCell sx={{ color: contrastText }}>Stock Change</TableCell>
              <TableCell sx={{ color: contrastText }}>Unit Cost</TableCell>
              <TableCell sx={{ color: contrastText }}>Value Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockAdjustment.inventory_movements.map((movement, index) => {
              const valueChange = movement.rate * movement.stock_change;
              return (
                <TableRow key={index} sx={{ backgroundColor: index % 2 ? lightColor : 'white' }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{movement.product.name}</TableCell>
                  <TableCell>{movement.product.measurement_unit.symbol}</TableCell>
                  <TableCell align="right">{movement.balance_before}</TableCell>
                  <TableCell align="right">{movement.actual_stock}</TableCell>
                  <TableCell align="right">{movement.stock_change}</TableCell>
                  <TableCell align="right">{movement.rate.toLocaleString()}</TableCell>
                  <TableCell align="right">{valueChange.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
            {/* Total Row */}
            <TableRow sx={{ backgroundColor: mainColor }}>
              <TableCell colSpan={7} align="right" sx={{ color: contrastText, fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell align="right" sx={{ color: contrastText, fontWeight: 'bold' }}>
                {totalValueChange.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Info */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color={mainColor}>Adjustment Reason</Typography>
          <Typography>{stockAdjustment.reason}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color={mainColor}>Narration</Typography>
          <Typography>{stockAdjustment.narration}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" color={mainColor}>Posted By</Typography>
          <Typography>{stockAdjustment.creator.name}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StockAdjustmentOnScreen;
