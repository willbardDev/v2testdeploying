import React, { useEffect, useState } from 'react';
import JumboCardQuick from '@jumbo/components/JumboCardQuick';
import { useJumboTheme } from '@jumbo/hooks';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Chip,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ExpandMoreOutlined, NotificationsActiveRounded } from '@mui/icons-material';
import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import { useDashboardSettings } from '../Dashboard';

function DueInvoices() {
  const { theme } = useJumboTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const midScreen = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { chartFilters: { to, cost_center_ids } } = useDashboardSettings();
  const [params, setParams] = useState({
    cost_center_ids,
    as_of: to,
  });

  useEffect(() => {
    setParams((params) => ({ ...params, as_of: to, cost_center_ids }));
  }, [to, cost_center_ids]);


  const dueInvoices = {
    outgoing : [
      // { id: 1, name : 'Jacob Limited', currencyCode: 'TZS', amount: 100000 },
      // { id: 2, name : 'ProsAfrica Limited', currencyCode: 'TZS', amount: 2000000 }
    ],
    incoming : [
      // { id: 1, name : 'Breve Limited', currencyCode: 'TZS', amount: 600000 },
      // { id: 2, name : 'FutureTech Limited', currencyCode: 'TZS', amount: 350000 },
    ],
  }


//   const DocumentDialog = ({ open, onClose, stores, store }) => {
//     const { authOrganization : {organization}} = useJumboAuth();
//     return (
//       <Dialog
//         open={open}
//         scroll={(smallScreen || !open) ? 'body' : 'paper'}
//         fullWidth
//         maxWidth="lg"
//         onClose={onClose}
//       >
//         <DialogContent>
//           <PDFContent fileName='Low Stock Alert' document={<LowStockAlertsPDF stores={stores} store={store} organization={organization}/>} />
//         </DialogContent>
//       </Dialog>
//     );
//   };

  return (
    <div>
      <JumboCardQuick
        title={'Due Invoices'}
        sx={{
          height: smallScreen && dueInvoices?.length < 1 ? 200 : (smallScreen || midScreen ? 295 : 310),
        }}
        // action={
        //   dueInvoices?.length > 0 && (
        //     <Tooltip title={'Print'}>
        //       <IconButton onClick={() => setOpenDocumentDialog(true)}>
        //         <Print />
        //       </IconButton>
        //     </Tooltip>
        //   )
        // }
      >
      {
        <JumboScrollbar
            autoHeight
            autoHeightMin={ dueInvoices?.length < 1 ? 200 : (smallScreen ? 300 : 250)}
            autoHide
            autoHideDuration={200}
            autoHideTimeout={500}
        >
        {
          dueInvoices.incoming.length > 0 &&
            <Accordion>
              <AccordionSummary
                  expandIcon={<ExpandMoreOutlined/>}
              >
                <Grid container>
                  <Grid item xs={9}>
                    <Tooltip title={'Name'}>
                      <Typography variant='h4'>Incoming</Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={2} textAlign={'end'}>
                    <Tooltip
                      title="Alerts found"
                    >
                      <Badge badgeContent={dueInvoices.incoming.length} color="secondary">
                          <NotificationsActiveRounded/>
                      </Badge>
                    </Tooltip>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <JumboScrollbar
                    autoHeight
                    autoHeightMin={smallScreen ? 350 : 270}
                    autoHide
                    autoHideDuration={200}
                    autoHideTimeout={500}
                >
                  {
                    dueInvoices.incoming.map((invoice,index) => (
                      <Grid container key={index} columnSpacing={1} rowSpacing={1} mt={1}
                        sx={{
                          cursor: 'pointer',
                          borderTop: 2,
                          borderColor: 'divider',
                          '&:hover': {
                              bgcolor: 'action.hover',
                          },
                          padding: 1,
                        }}
                      >
                          <Grid item xs={6} md={8}>
                              <Tooltip title={'Name'}>
                                  <Typography>{invoice.name}</Typography>
                              </Tooltip>
                          </Grid>
                          <Grid item xs={6} md={4} textAlign={'end'}>
                            <Tooltip title={'Amount'}>
                                <Chip label={invoice.amount.toLocaleString("en-US", {style:"currency", currency: invoice.currencyCode})}/>
                              </Tooltip>
                          </Grid>
                      </Grid>
                    ))
                  }
                </JumboScrollbar>
              </AccordionDetails>
            </Accordion>
        }
        {
          dueInvoices.outgoing.length > 0 &&
            <Accordion>
              <AccordionSummary
                  expandIcon={<ExpandMoreOutlined/>}
              >
                <Grid container>
                  <Grid item xs={9}>
                    <Tooltip title={'Name'}>
                      <Typography variant='h4'>Outgoing</Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={2} textAlign={'end'}>
                    <Tooltip
                      title="Alerts found"
                    >
                      <Badge badgeContent={dueInvoices.outgoing.length} color="secondary">
                          <NotificationsActiveRounded/>
                      </Badge>
                    </Tooltip>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <JumboScrollbar
                    autoHeight
                    autoHeightMin={smallScreen ? 350 : 270}
                    autoHide
                    autoHideDuration={200}
                    autoHideTimeout={500}
                >
                  {
                    dueInvoices.incoming.map((invoice,index) => (
                      <Grid container key={index} columnSpacing={1} rowSpacing={1} mt={1}
                        sx={{
                          cursor: 'pointer',
                          borderTop: 2,
                          borderColor: 'divider',
                          '&:hover': {
                              bgcolor: 'action.hover',
                          },
                          padding: 1,
                        }}
                      >
                          <Grid item xs={6} md={8}>
                              <Tooltip title={'Name'}>
                                  <Typography>{invoice.name}</Typography>
                              </Tooltip>
                          </Grid>
                          <Grid item xs={6} md={4} textAlign={'end'}>
                            <Tooltip title={'Amount'}>
                                <Chip label={invoice.amount.toLocaleString("en-US", {style:"currency", currency: invoice.currencyCode})}/>
                              </Tooltip>
                          </Grid>
                      </Grid>
                    ))
                  }
                </JumboScrollbar>
              </AccordionDetails>
            </Accordion>
        }
        {
           dueInvoices.incoming.length === 0  && dueInvoices.outgoing.length === 0  &&  <Alert variant={'outlined'} severity={'info'}>No due invoices for the selected period</Alert>
        }
        </JumboScrollbar>
      }
      </JumboCardQuick>
    </div>
  );
}

export default DueInvoices;
