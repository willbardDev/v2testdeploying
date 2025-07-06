import { Alert, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, Typography } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import PdfLogo from '../../../pdf/PdfLogo';
import pdfStyles from '../../../pdf/pdf-styles';
import PDFContent from '../../../pdf/PDFContent';
import financialReportsServices from '../financial-reports-services';
import BalanceSheetOnScreen from './BalanceSheetOnScreen';
import { useSnackbar } from 'notistack';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';
import useProsERPStyles from '@/app/helpers/style-helpers';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { Div, Span } from '@jumbo/shared';

const ReportDocument = ({reportData,authOrganization,user}) => {
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const reportPeriod = `As at: ${readableDate(reportData.filters?.as_at,true)}`;

    return reportData ?
    (
      <Document 
        creator={` ${user.name} | Powered By ProsERP` }
        producer='ProsERP'
        title={`Balance Sheet ${reportPeriod}`}
      >
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.table}>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 20 }}>
              <View style={{ flex: 1, maxWidth: 120}}>
                <PdfLogo organization={authOrganization.organization}/>
              </View>
              <View style={{ flex: 1, textAlign: 'right' }}>
                <Text style={{...pdfStyles.majorInfo, color: mainColor }}>{`Balance Sheet`}</Text>
                <Text style={{ ...pdfStyles.minInfo }}>{reportPeriod}</Text>
              </View>
            </View>
          </View>
          <View style={{ ...pdfStyles.tableRow, marginTop: 10}}>
            <View style={{ flex: 1, padding: 2}}>
              <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed By</Text>
              <Text style={{...pdfStyles.minInfo }}>{user.name}</Text>
            </View>
            <View style={{ flex: 1, padding: 2}}>
              <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed On</Text>
              <Text style={{...pdfStyles.minInfo }}>{readableDate(undefined,true)}</Text>
            </View>
          </View>
          {
            reportData?.balanceSheetData?.map((ledger_group,index) => {
              return (
                <View style={{ ...pdfStyles.table, marginTop: 15 }} key={index}>
                  <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{...pdfStyles.tableHeader, flex : 1}}>
                      <Text style={pdfStyles.tableCellText}>{ledger_group.name}</Text>
                    </View>
                  </View>
                  {
                    ledger_group.children?.map((group,index) => {
                      return (
                        <View key={index} style={{ ...pdfStyles.tableRow, marginLeft: 5 }}>
                          {
                            group.amount !== 0 && 
                              <View style={pdfStyles.table}>
                                {group.children?.length > 0 && // header only if have children
                                  <View style={{ ...pdfStyles.tableRow}}>
                                    <View style={{...pdfStyles.tableHeader, backgroundColor: pdfStyles.shadedBG, flex : 1}}>
                                      <Text style={{ ...pdfStyles.tableCellText}}>{group.name}</Text>
                                    </View>
                                  </View>
                                }
                                {/* child items */}
                                {group.children?.map((lg, i) => (
                                  <View key={i} style={{ ...pdfStyles.tableRow, marginLeft: 5 }}>
                                    {
                                      lg.amount !== 0 &&
                                      <>
                                        <View style={{...pdfStyles.tableCell, flex : 1}}>
                                          <Text style={{ ...pdfStyles.tableCellText}}>{lg.name}</Text>
                                        </View>
                                        <View style={{...pdfStyles.tableCell, flex : 1}}>
                                          <Text style={{ ...pdfStyles.tableCellText, textAlign:'right'}}>{lg.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                                        </View>
                                      </>
                                    }
                                  </View>
                                ))}
                                {/* total if group has children */}
                                {group.children.length > 0 && (
                                  <View style={{ ...pdfStyles.tableRow}}>
                                    <View style={{...pdfStyles.tableHeader, backgroundColor: pdfStyles.shadedBG, flex : 1}}>
                                      <Text style={{ ...pdfStyles.tableCellText}}>Total {group.name}</Text>
                                    </View>
                                    <View style={{...pdfStyles.tableHeader, backgroundColor: pdfStyles.shadedBG, flex : 1}}>
                                      <Text style={{ ...pdfStyles.tableCellText,textAlign:'right'}}>{group.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                                    </View>
                                  </View>
                                )}
                                {/* name and amount directly if group has no children */}
                                {group.children.length === 0 && (
                                  <View style={{ ...pdfStyles.tableRow}}>
                                    <View style={{...pdfStyles.tableCell, flex : 1}}>
                                      <Text style={{ ...pdfStyles.tableCellText}}>{group.name}</Text>
                                    </View>
                                    <View style={{...pdfStyles.tableCell, flex : 1}}>
                                      <Text style={{ ...pdfStyles.tableCellText, textAlign:'right'}}>{group.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                                    </View>
                                  </View>
                                )}
                              </View>
                          }
                        </View>
                      );
                    })
                  }
                  <View style={{ ...pdfStyles.tableRow}}>
                    <View style={{...pdfStyles.tableHeader, flex : 1.02}}>
                      <Text style={pdfStyles.tableCellText}>Total {ledger_group.name}</Text>
                    </View>
                    <View style={{...pdfStyles.tableHeader, flex : 1}}>
                      <Text style={{ ...pdfStyles.tableCellText, textAlign:'right' }}>{ledger_group.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
          <View style={{ ...pdfStyles.tableRow,marginTop: 5}}>
            <View style={{...pdfStyles.tableHeader, flex : 1.02}}>
              <Text style={pdfStyles.tableCellText}>Total Liabilities and Owner's Equity</Text>
            </View>
            <View style={{...pdfStyles.tableHeader, flex : 1}}>
              <Text style={{ ...pdfStyles.tableCellText, textAlign:'right' }}>
                {
                  reportData?.balanceSheetData?.filter((ledger_group) => ledger_group.id !== 1)
                  .reduce((total, ledger_group) => {return total + ledger_group.amount;}, 0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})
                }
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    ) : ''
  }

  function BalanceSheet({ as_at }) {
    document.title = 'Balance Sheet';
    const css = useProsERPStyles();
    const [displayAs, setDisplayAs] = useState('on screen');
    const [triggerFetch, setTriggerFetch] = useState(as_at ? true : false);
    const { enqueueSnackbar } = useSnackbar();
    const { authOrganization, authUser: { user } } = useJumboAuth();
    const [isFetching, setisFetching] = useState(false);
    const [reportData, setReportData] = useState(null);
  
    const validationSchema = yup.object({
      as_at: yup.string().required('Date is required').typeError('Date is required'),
    });
  
    const { setValue, handleSubmit, watch } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        as_at: as_at ? dayjs(as_at).toISOString() : dayjs().toISOString(),
      },
    });
  
    const retrieveReport = async (filters) => {
      setisFetching(true);
      const report = await financialReportsServices.balanceSheet({
        as_at: filters.as_at,
        display_as: displayAs
      });

      if(displayAs === 'excel'){
        downloadExcel(report,filters.as_at);
      }
      setReportData(report);
      setisFetching(false);
    };

    const downloadExcel = async (reportData,as_at) => {
      try {
        // Create a Blob from the response data
        const blob = new Blob([reportData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Balance Sheet as at ${readableDate(as_at,true)}.xlsx`;
        link.click();
      } catch (error) {
        enqueueSnackbar('Error downloading Excel template', { variant: 'error' });
      }
    };

    useEffect(() => {
      if (as_at && !!triggerFetch) {// this if is special to trigger data fetch when dialog opened from Dashboard
        retrieveReport({
          as_at: as_at,
          display_as: 'on screen'
        });
        setTriggerFetch(false);
      } else if (displayAs === 'excel') {
        setReportData(null);
        retrieveReport({
          as_at: watch(`as_at`),
          display_as: displayAs
        });
        setTriggerFetch(true);
      } else if (!!triggerFetch && !reportData?.balanceSheetData && (displayAs === 'on screen' || displayAs === 'pdf')) {
        retrieveReport({
          as_at: watch(`as_at`),
          display_as: displayAs
        });
      }
    }, [as_at, displayAs]);
  
    return (
      <>
        <DialogTitle textAlign={'center'}>
          <Grid container>
            <Grid size={{xs: 12 }}>
              <Typography variant="h3">Balance Sheet</Typography>
            </Grid>
          </Grid>
          <Span className={css.hiddenOnPrint}>
            <form autoComplete="off" onSubmit={handleSubmit(retrieveReport)}>
              <Grid
                container
                columnSpacing={1}
                rowSpacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid size={{xs: 12, md: 4}}>
                  <Div sx={{ mt: 1, mb: 1 }}>
                    <DateTimePicker
                      label="As at (MM/DD/YYYY)"
                      defaultValue={as_at ? dayjs(as_at) : dayjs()}
                      minDate={dayjs(authOrganization?.organization.recording_start_date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                      onChange={(newValue) => {
                        setValue('as_at', newValue ? newValue.toISOString() : null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                  </Div>
                </Grid>
                <Grid size={{xs: 12, md: 2, lg: 1}} textAlign="right">
                  <LoadingButton loading={isFetching} type="submit" onClick={()=> setTriggerFetch(true)} size="small" variant="contained">
                    Filter
                  </LoadingButton>
                </Grid>
                <Grid size={{xs: 12}}>
                  <FormControl>
                    <FormLabel id="display_as_radiobuttons">Display As</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="display_as_radiobuttons"
                      name="row-radio-buttons-group"
                      value={displayAs}
                      onChange={(e) => setDisplayAs(e.target.value)}
                    >
                      <FormControlLabel value="on screen" control={<Radio />} label="On Screen" />
                      <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                      <FormControlLabel value="excel" control={<Radio />} label="Excel" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Span>
        </DialogTitle>
        <DialogContent>
          {isFetching ? (
            <LinearProgress />
          ) : (
            reportData && (
              (displayAs === 'pdf') ? (
                <PDFContent
                  document={<ReportDocument reportData={reportData} authOrganization={authOrganization} user={user} />}
                  fileName={`Balance Sheet as of ${readableDate(reportData?.filters?.as_at, true)}`}
                />
              ) : (displayAs === 'excel') ? (
                <Alert variant={'outlined'} severity={'success'}>
                  <Typography>Please check your downloads folder for the downloaded excel file</Typography>
                </Alert>
                // downloadExcelTemplate(reportData)
              ) : (displayAs === 'on screen') ? (
                <BalanceSheetOnScreen reportData={reportData}/>
              ) : ''
            )
          )}
        </DialogContent>
      </>
    );
  }

export default BalanceSheet
