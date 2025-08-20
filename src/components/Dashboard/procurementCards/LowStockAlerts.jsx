import React, { useEffect, useState } from 'react';
import { useDashboardSettings } from '../Dashboard';
import JumboCardQuick from '@jumbo/components/JumboCardQuick';
import { useJumboTheme } from '@jumbo/hooks';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from 'react-query';
import lowStockThresholdServices from '../../procurement/stores/profile/storeStock/lowStockThresholds/lowStockThreshold-services';
import { ExpandMoreOutlined, NotificationsActiveRounded, Print } from '@mui/icons-material';
import JumboChipsGroup from '@jumbo/components/JumboChipsGroup';
import Div from '@jumbo/shared/Div';
import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import PDFContent from '../../pdf/PDFContent';
import LowStockAlertsPDF from './LowStockAlertsPDF';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';

function LowStockAlerts() {
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
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

  const { data: stores, isLoading } = useQuery(['lowStockAlerts', params], async () => {
    return await lowStockThresholdServices.alerts(params);
  });

  const DocumentDialog = ({ open, onClose, stores, store }) => {
    const { authOrganization : {organization}} = useJumboAuth();
    return (
      <Dialog
        open={open}
        scroll={(smallScreen || !open) ? 'body' : 'paper'}
        fullWidth
        maxWidth="lg"
        onClose={onClose}
      >
        <DialogContent>
          <PDFContent fileName='Low Stock Alert' document={<LowStockAlertsPDF stores={stores} store={store} organization={organization}/>} />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <JumboCardQuick
        title={'Low Stock Alerts'}
        sx={{
          height: !isLoading && smallScreen && stores.length < 1 ? 200 : (smallScreen || midScreen ? 350 : 310),
        }}
        action={
          stores?.length > 0 && (
            <Tooltip title={'Print'}>
              <IconButton onClick={() => setOpenDocumentDialog(true)}>
                <Print />
              </IconButton>
            </Tooltip>
          )
        }
      >
      {
        isLoading ? <LinearProgress/> :
        <JumboScrollbar
            autoHeight
            autoHeightMin={ !isLoading && stores.length < 1 ? 200 : (smallScreen ? 300 : 250)}
            autoHide
            autoHideDuration={200}
            autoHideTimeout={500}
        >
          {
            stores.length > 0 ? stores.map(store => (
              <Accordion key={store.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreOutlined/>}
                    >
                      <Grid container>
                        <Grid item xs={9}>
                          <Tooltip title={'Store Name'}>
                            <Typography variant='h4'>{store.name}</Typography>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={2} textAlign={'end'}>
                          <Tooltip
                            title="Alerts found"
                          >
                            <Badge badgeContent={store.alerts.length} color="secondary">
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
                          store.alerts.map((alert,index) => (
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
                                <Grid item xs={12} lg={8}>
                                  <Tooltip title={'Product Name'}>
                                      <Typography>{alert.product_name}</Typography>
                                  </Tooltip>
                                </Grid>
                                <Grid item xs={6} lg={2} textAlign={'end'}>
                                  <Tooltip title={'Threshold'}>
                                      <Chip label={alert.threshold} color={'primary'}/>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={6} lg={2} textAlign={'end'}>
                                  <Tooltip title={'Available Stock'}>
                                      <Chip label={alert.available_stock} color={alert.available_stock > 0 ? 'warning' : 'error'}/>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12}>
                                  <Tooltip title={'Cost Centers'}>
                                    <Div>
                                      <JumboChipsGroup
                                          chips={alert.cost_centers}
                                          mapKeys={{label: "name"}}
                                          spacing={1}
                                          size={"small"}
                                          max={3}
                                      />
                                    </Div>
                                  </Tooltip>
                                </Grid>
                            </Grid>
                          ))
                        }
                      </JumboScrollbar>
                    </AccordionDetails>
                </Accordion>
            )) :  <Alert variant={'outlined'} severity={'info'}>No any low stock alerts</Alert>
          }
        </JumboScrollbar>
      }
      </JumboCardQuick>

      {/* Render the DocumentDialog*/}
      <DocumentDialog open={openDocumentDialog} stores={stores} onClose={() => setOpenDocumentDialog(false)}/>
    </div>
  );
}

export default LowStockAlerts;
