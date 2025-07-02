import React, { useState } from 'react'
import posServices from '../../../pos-services';
import { useQuery } from 'react-query';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { Alert, Box, Grid, IconButton, LinearProgress, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { AttachmentOutlined, ContentPasteSearchOutlined, DeleteOutlined } from '@mui/icons-material';
import SaleReceiptItemAction from './SaleReceiptItemAction';
import { useJumboTheme } from '@jumbo/hooks';

function SaleReceipts({expanded, sale, activeTab}) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [openReceiptDeleteDialog, setOpenReceiptDeleteDialog] = useState(false);
  const [openReceiptEditDialog, setOpenReceiptEditDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [attachDialog, setAttachDialog] = useState(false);

  //Screen handling constants
  const {theme} = useJumboTheme();
  const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { data: saleReceipts, isLoading } = useQuery(
    ['SaleReceipts', {saleId: sale.id}],() => posServices.saleReceipts(sale.id),
    {
      enabled: !!expanded && activeTab === (
        !sale.is_instant_sale ? 1 : 0
      )
    }
  );

  return (
    <>  
      {
        isLoading && <LinearProgress/>
      }
      {
        saleReceipts?.length > 0 ? saleReceipts.map((receipt) => (
        <Grid
          key={receipt.id}
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
          <Grid item xs={6} md={3} lg={2}>
            <Tooltip title={'Receipt No.'}>
              <Typography fontWeight={'bold'}>{receipt?.voucherNo}</Typography>
            </Tooltip>
            <Tooltip title={'Receipt Date'}>
              <Typography>
                {readableDate(receipt?.transaction_date)}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={4} lg={4} mt={0.5}>
            <Tooltip title={'Narration'}>
              <Typography>{receipt?.narration}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={3} lg={2} mt={0.5}>
            <Tooltip title={'Account'}>
              <Typography>{receipt?.debit_ledger?.name}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={2} lg={2} textAlign={'end'}>
            <Tooltip title={'Amount'}>
              <Typography fontWeight={'bold'}>{receipt.amount.toLocaleString("en-US", {style:"currency", currency:receipt.currency.code})}</Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'flex-end'}
            >
              <Tooltip title={belowLargeScreen ? `Download ${receipt.voucherNo}` : `View ${receipt.voucherNo}`}>
                <IconButton
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setOpenDocumentDialog(true);
                  }}
                >
                  {
                    <ContentPasteSearchOutlined fontSize={'small'}/>
                  }
                </IconButton>
              </Tooltip>

              <Tooltip  title={`${receipt.voucherNo} Attachments`}>
                  <IconButton onClick={() => {
                      setAttachDialog(true);
                      setSelectedReceipt(receipt)
                  }}>
                      <AttachmentOutlined/>
                  </IconButton>
              </Tooltip>
    
              {/* <Tooltip  title={`Edit ${receipt.voucherNo}`}>
                <IconButton 
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setOpenReceiptEditDialog(true);
                  }} 
                >
                  <EditOutlined fontSize={'small'} />
                </IconButton>
              </Tooltip> */}
              <Tooltip title={`Delete ${receipt.voucherNo}`}>
                <IconButton
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setOpenReceiptDeleteDialog(true);
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
        !isLoading && <Alert variant='outlined' color='primary' severity='info'>No Receipts Found</Alert> 
      }

      {/*Receipt Item Action*/}
      <SaleReceiptItemAction
        openDocumentDialog={openDocumentDialog}
        setOpenDocumentDialog={setOpenDocumentDialog}
        setOpenReceiptEditDialog={setOpenReceiptEditDialog}
        openReceiptDeleteDialog={openReceiptDeleteDialog}
        openReceiptEditDialog={openReceiptEditDialog}
        setOpenReceiptDeleteDialog={setOpenReceiptDeleteDialog} 
        selectedReceipt={selectedReceipt}
        setSelectedReceipt={setSelectedReceipt}
        setAttachDialog={setAttachDialog}
        attachDialog={attachDialog}
      />
    </>      
  )
}

export default SaleReceipts