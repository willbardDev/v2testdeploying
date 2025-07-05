import React from 'react';
import { Box, Grid, Typography, Divider, Button } from '@mui/material';
import QRCode from 'qrcode';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';

interface Organization {
  name: string;
  address?: string;
  tin?: string;
  vrn?: string;
  phone?: string;
  tra_serial_number?: string;
  email?: string;
}

interface SaleItem {
  product: {
    name: string;
  };
  quantity: number;
  rate: number;
  measurement_unit: {
    symbol: string;
  };
  vat_exempted?: number;
}

interface VFDReceipt {
  verification_url: string;
  created_at: string;
  receipt_time: string;
  customer_name?: string;
  customer_tin?: string;
  customer_vrn?: string;
  verification_code: string;
}

interface Stakeholder {
  name: string;
  tin?: string;
  vrn?: string;
  email?: string;
  phone?: string;
}

interface Creator {
  name: string;
}

interface Currency {
  code: string;
}

interface SalesOutlet {
  name: string;
}

interface Sale {
  saleNo: string;
  vat_percentage: number;
  sale_items: SaleItem[];
  amount: number;
  currency: Currency;
  vfd_receipt?: VFDReceipt;
  transaction_date: string;
  reference?: string;
  stakeholder: Stakeholder;
  creator: Creator;
  sales_outlet: SalesOutlet;
}

interface ReceiptPreviewOnScreenProps {
  setOpenReceiptDialog: (open: boolean) => void;
  organization: Organization;
  sale: Sale;
}

const ReceiptPreviewOnScreen: React.FC<ReceiptPreviewOnScreenProps> = ({ 
  setOpenReceiptDialog, 
  organization, 
  sale 
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);

  const vatFactor = sale.vat_percentage * 0.01;

  // Total for only items requiring VAT inclusive
  const totalAmountForVAT = sale.sale_items.filter(item => item.vat_exempted !== 1).reduce((total, item) => {
    return total + (item.rate * item.quantity);
  }, 0);

  const vatAmount = totalAmountForVAT * sale.vat_percentage / 100; // Total VAT

  const generateQRCodeDataUrl = async (url: string): Promise<string | null> => {
    try {
      return await QRCode.toDataURL(url);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      return null;
    }
  };

  React.useEffect(() => {
    if (sale.vfd_receipt?.verification_url) {
      generateQRCodeDataUrl(sale.vfd_receipt.verification_url).then(setQrCodeDataUrl);
    }
  }, [sale.vfd_receipt]);

  return (
    <Box padding={2}>
      {/* Organization Information */}
      <Grid container spacing={1} textAlign="center">
        <Grid size={12}>
          <Typography variant="h6" fontWeight="bold">{organization.name}</Typography>
        </Grid>
        {organization.address && (
          <Grid size={12}>
            <Typography variant="body2">{organization.address}</Typography>
          </Grid>
        )}
        {organization.tin && (
          <Grid container spacing={1} justifyContent="center">
            <Grid>
              <Typography variant="body2" fontWeight="bold">TIN:</Typography>
            </Grid>
            <Grid>
              <Typography variant="body2">{organization.tin}</Typography>
            </Grid>
          </Grid>
        )}
        {organization.vrn && (
          <Grid container spacing={1} justifyContent="center">
            <Grid>
              <Typography variant="body2" fontWeight="bold">VRN:</Typography>
            </Grid>
            <Grid>
              <Typography variant="body2">{organization.vrn}</Typography>
            </Grid>
          </Grid>
        )}
        {organization.phone && (
          <Grid container spacing={1} justifyContent="center">
            <Grid>
              <Typography variant="body2" fontWeight="bold">Phone:</Typography>
            </Grid>
            <Grid>
              <Typography variant="body2">{organization.phone}</Typography>
            </Grid>
          </Grid>
        )}
        {organization.tra_serial_number && (
          <Grid container spacing={1} justifyContent="center">
            <Grid>
              <Typography variant="body2" fontWeight="bold">Serial Number:</Typography>
            </Grid>
            <Grid>
              <Typography variant="body2">{organization.tra_serial_number}</Typography>
            </Grid>
          </Grid>
        )}
        {organization.email && (
          <Grid size={12}>
            <Typography variant="body2">{organization.email}</Typography>
          </Grid>
        )}
        <Grid size={12}>
          <Typography variant="body2" fontWeight="bold">{sale.sales_outlet.name}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Receipt Information */}
      <Grid container spacing={1}>
        <Grid size={6}>
          <Typography variant="body2" fontWeight="bold">Receipt No.</Typography>
        </Grid>
        <Grid size={6} textAlign="right">
          <Typography variant="body2">{sale.saleNo}</Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" fontWeight="bold">Date</Typography>
        </Grid>
        <Grid size={6} textAlign="right">
          <Typography variant="body2">
            {readableDate(sale?.vfd_receipt ? sale.vfd_receipt.created_at : sale.transaction_date)}
          </Typography>
        </Grid>
        {sale?.vfd_receipt && (
          <>
            <Grid size={6}>
              <Typography variant="body2" fontWeight="bold">Time</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">{sale.vfd_receipt.receipt_time}</Typography>
            </Grid>
          </>
        )}
        {sale.reference && (
          <>
            <Grid size={6}>
              <Typography variant="body2" fontWeight="bold">Reference</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">{sale.reference}</Typography>
            </Grid>
          </>
        )}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Customer Information */}
      <Grid container spacing={1}>
        <Grid size={6}>
          <Typography variant="body2" fontWeight="bold">Customer Name</Typography>
        </Grid>
        <Grid size={6} textAlign="right">
          <Typography variant="body2">
            {sale?.vfd_receipt?.customer_name ? sale.vfd_receipt.customer_name : sale.stakeholder.name}
          </Typography>
        </Grid>
        {(sale?.vfd_receipt?.customer_tin || sale.stakeholder?.tin) && (
          <>
            <Grid size={6}>
              <Typography variant="body2" fontWeight="bold">Customer TIN</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">
                {sale?.vfd_receipt?.customer_tin ? sale.vfd_receipt.customer_tin : sale.stakeholder.tin}
              </Typography>
            </Grid>
          </>
        )}
        {(sale?.vfd_receipt?.customer_vrn || sale.stakeholder?.vrn) && (
          <>
            <Grid size={6}>
              <Typography variant="body2" fontWeight="bold">Customer VRN</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">
                {sale?.vfd_receipt?.customer_vrn ? sale.vfd_receipt.customer_vrn : sale.stakeholder.vrn}
              </Typography>
            </Grid>
          </>
        )}
        {sale.stakeholder?.email && (
          <>
            <Grid size={6}>
              <Typography variant="body2" fontWeight="bold">Email</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">{sale.stakeholder.email}</Typography>
            </Grid>
          </>
        )}
        {sale.stakeholder?.phone && (
          <>
            <Grid size={6}>
              <Typography variant="body2" fontWeight="bold">Phone</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">{sale.stakeholder.phone}</Typography>
            </Grid>
          </>
        )}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Sale Items */}
      {sale.sale_items.map((item, index) => (
        <React.Fragment key={index}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Typography variant="body2">{item.product.name}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">
                {`${item.quantity} ${item.measurement_unit.symbol} X ${(item.rate * (1 + (item?.vat_exempted !== 1 ? vatFactor : 0))).toLocaleString()}`}
              </Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2">
                {(item.quantity * item.rate * (1 + (item?.vat_exempted !== 1 ? vatFactor : 0))).toLocaleString('en-US', { 
                  maximumFractionDigits: 2, 
                  minimumFractionDigits: 2 
                })}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}

      {/* Total Amount and VAT Amount */}
      <Grid container spacing={1}>
        <Grid size={6}>
          <Typography variant="body2">TOTAL</Typography>
        </Grid>
        <Grid size={6} textAlign="right">
          <Typography variant="body2" fontWeight="bold">
            {sale.amount.toLocaleString("en-US", { 
              style: "currency", 
              currency: sale.currency.code 
            })}
          </Typography>
        </Grid>
        {sale.vat_percentage > 0 && (
          <>
            <Grid size={6}>
              <Typography variant="body2">VAT</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2" fontWeight="bold">
                {vatAmount.toLocaleString("en-US", { 
                  style: "currency", 
                  currency: sale.currency.code 
                })}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">Total (VAT Incl.)</Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography variant="body2" fontWeight="bold">
                {(sale.amount + vatAmount).toLocaleString("en-US", { 
                  style: "currency", 
                  currency: sale.currency.code 
                })}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>

      {sale.vfd_receipt && (
        <>
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Receipt Verification Code
            </Typography>
            <Typography variant="body2">{sale.vfd_receipt.verification_code}</Typography>
          </Box>
          {qrCodeDataUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <img src={qrCodeDataUrl} alt="QR Code" style={{ width: 100, height: 100 }} />
            </Box>
          )}
        </>
      )}

      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Typography variant="body2">Served by: {sale.creator.name}</Typography>
        <Typography variant="body2" sx={{ fontSize: 10 }}>
          Powered by: proserp.co.tz
        </Typography>
      </Box>

      {/* Cancel Button */}
      <Box textAlign="right" marginTop={5}>
        <Button 
          variant="outlined" 
          size='small' 
          color="primary" 
          onClick={() => setOpenReceiptDialog(false)}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ReceiptPreviewOnScreen;