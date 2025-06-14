import React, { useContext } from 'react'
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { AttachmentOutlined, UndoOutlined, VisibilityOutlined } from '@mui/icons-material';
import { listItemContext } from './PurchaseOrderListItem';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function PurchaseOrderGrns({order}) {
    const { setAttachDialog, setSelectedOrderGrn, setOpenDialog, setOpenDocumentDialog, purchaseOrderGrns} = useContext(listItemContext);
    const {checkOrganizationPermission} = useJumboAuth();

  return (
    <React.Fragment>
        {purchaseOrderGrns?.length > 0 && <Typography variant="body1">Order Grns</Typography>}
        {purchaseOrderGrns &&
        purchaseOrderGrns.map((orderGrn) => (
            <Grid
            key={orderGrn.id}
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
            container
            >
            <Grid item xs={4} md={3}>
                <Tooltip title={'Date Received'}>
                    <Typography>
                        {readableDate(orderGrn?.date_received)}
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={4} md={3} align="center">
                <Tooltip title={'Grn No.'}>
                   <Typography>{orderGrn?.grnNo}</Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={4} md={4} align="end">
                <Tooltip title={'Reference'}>
                  <Typography>{orderGrn?.reference}</Typography>
                </Tooltip>
            </Grid>
            <Grid item xs={12} md={2}>
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'flex-end'}
                >
                    {order.status !== 'Instantly Received' && order.status !== 'Closed' && checkOrganizationPermission([PERMISSIONS.PURCHASES_UNRECEIVE]) &&
                        <Tooltip title={`Unreceive ${orderGrn.grnNo}`}>
                            <IconButton
                                onClick={() => {
                                    setSelectedOrderGrn(orderGrn);
                                    setOpenDialog(true);
                                }}
                            >
                            <UndoOutlined color='error'/>
                            </IconButton>
                        </Tooltip>
                    }

                    <Tooltip  title={`${orderGrn.grnNo} Attachments`}>
                        <IconButton onClick={() => {
                            setSelectedOrderGrn(orderGrn);
                            setAttachDialog(true);
                            setOpenDocumentDialog(false)
                        }}>
                           <AttachmentOutlined/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`View ${orderGrn.grnNo}`}>
                        <IconButton
                            onClick={() => {
                                setSelectedOrderGrn(orderGrn);
                                setOpenDocumentDialog(true);
                            }}
                        >
                            <VisibilityOutlined
                                style={{ marginRight: '8px' }}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Grid>
            </Grid>
        ))}
    </React.Fragment>
  )
}

export default PurchaseOrderGrns