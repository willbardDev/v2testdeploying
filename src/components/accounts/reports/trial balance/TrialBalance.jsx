import Span from '@jumbo/shared/Span/Span';
import { DialogContent, DialogTitle, Grid, LinearProgress, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Div from '@jumbo/shared/Div/Div';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import useProsERPStyles from 'app/helpers/style-helpers';
import { DateTimePicker } from '@mui/x-date-pickers';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import PdfLogo from '../../../pdf/PdfLogo';
import pdfStyles from '../../../pdf/pdf-styles';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import PDFContent from '../../../pdf/PDFContent';
import financialReportsServices from '../financial-reports-services';
import CostCenterSelector from '../../../masters/costCenters/CostCenterSelector';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { useJumboTheme } from '@jumbo/hooks';
import TrialBalanceOnScreen from './TrialBalanceOnScreen';


const ReportDocumet = ({reportData,authOrganization,user}) => {
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";
    const reportPeriod = `As at: ${readableDate(reportData.filters.as_at,true)}`;
    const costCenters = reportData.filters.cost_centers;
    
    return reportData ?
    (
      <Document 
        creator={` ${user.name} | Powered By ProsERP` }
        producer='ProsERP'
        title={`Trial Balance ${reportPeriod}`}
      >
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.table}>
            <View style={{ ...pdfStyles.tableRow, marginBottom: 20 }}>
                <View style={{ flex: 1, maxWidth: 120}}>
                    <PdfLogo organization={authOrganization.organization}/>
                </View>
                <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={{...pdfStyles.majorInfo, color: mainColor }}>{`Trial Balance`}</Text>
                    <Text style={{ ...pdfStyles.minInfo }}>{reportPeriod}</Text>
                </View>
            </View>
          </View>
          <View style={{ ...pdfStyles.tableRow, marginTop: 10, marginBottom: 10}}>
          {
                Array.isArray(costCenters) && costCenters.length > 0 &&
                <View style={{ flex: 2, padding: 2}}>
                    <Text style={{...pdfStyles.minInfo, color: mainColor }}>Cost Centers</Text>
                    <Text style={{...pdfStyles.minInfo }}>{costCenters.map((cost_centers) => cost_centers.name).join(', ')}</Text>
                </View>
            }
              <View style={{ flex: 1, padding: 2}}>
                  <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed By</Text>
                  <Text style={{...pdfStyles.minInfo }}>{user.name}</Text>
              </View>
              <View style={{ flex: 1, padding: 2}}>
                  <Text style={{...pdfStyles.minInfo, color: mainColor }}>Printed On</Text>
                  <Text style={{...pdfStyles.minInfo }}>{readableDate(undefined,true)}</Text>
              </View>
          </View>
          <View style={pdfStyles.table}>
              <View style={pdfStyles.tableRow}>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 0.3 }}>S/N</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 3 }}>Ledger Name</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Debit</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Credit</Text>
              </View>

              {
                reportData.ledgers.filter(ledger => ledger.balance.amount !== 0).map((ledger,index) => (

                    <View key={index} style={pdfStyles.tableRow}>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 0.3 }}>{index+1}</Text>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 3 }}>{ledger.name}</Text>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1,textAlign: 'right' }}>{ledger.balance.side === 'DR' && ledger.balance.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1,textAlign: 'right' }}>{ledger.balance.side === 'CR' && ledger.balance.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                    </View>
                ))
              }
              <View style={pdfStyles.tableRow}>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 3.5 }}>TOTAL</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,textAlign: 'right', flex: 1 }}>{reportData.ledgers.filter(ledger => ledger.balance.side === 'DR').reduce((totalDebits,ledger) => totalDebits + ledger.balance.amount,0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,textAlign: 'right', flex: 1 }}>{reportData.ledgers.filter(ledger => ledger.balance.side === 'CR').reduce((totalCredits,ledger) => totalCredits + ledger.balance.amount,0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
              </View>
          </View>
        </Page>
      </Document>
    ) : ''
  }

function TrialBalance() {
    document.title = 'Trial Balance';
    const css = useProsERPStyles();
    const { authOrganization, authUser: {user}, checkOrganizationPermission } = useJumboAuth();
    const validationSchema = yup.object({
        as_at: yup.string().required('Date is required').typeError('Date is required'),
    });

    const { setValue, watch, handleSubmit } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
          as_at: dayjs().toISOString(),
          cost_center_ids: checkOrganizationPermission(PERMISSIONS.COST_CENTERS_ALL) ? 'all' : authOrganization.costCenters.map(cost_center => cost_center.id)
        },
    });

    const [isFetching, setisFetching] = useState(false);

    const [reportData, setReportData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    //Screen handling constants
    const {theme} = useJumboTheme();
    const belowLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };

    const retrieveReport = async (filters) => {
        setisFetching(true);
        const report = await financialReportsServices.trialBalance(filters);
        
        setReportData(report);
        setisFetching(false);
    };

    const downloadFileName = `Trial Balance as of ${readableDate(watch('as_at'),true)}`;

  return (
    <>
      <DialogTitle textAlign={'center'}>
        <Grid container>
          <Grid item xs={12} mb={2}>
            <Typography variant="h3">Trial Balance</Typography>
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
              <Grid item xs={12} md={10} lg={5}>
                <CostCenterSelector
                  label="Cost Centers"
                  multiple={true}
                  defaultValue={authOrganization.costCenters}
                  allowSameType={true}
                  onChange={(cost_centers) => {
                    setValue('cost_center_ids', cost_centers.map((cost_center) => cost_center.id));
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Div sx={{ mt: 1, mb: 1 }}>
                  <DateTimePicker
                    label="As at (MM/DD/YYYY)"
                    fullWidth
                    defaultValue={dayjs()}
                    minDate={dayjs(authOrganization.organization.recording_start_date)}
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
              <Grid item xs={12} md={2} lg={1} textAlign="right">
                <LoadingButton loading={isFetching} type="submit" size="small" variant="contained">
                  Filter
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </Span>
        {reportData && belowLargeScreen && (
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="On-Screen" />
            <Tab label="PDF" />
          </Tabs>
        )}
      </DialogTitle>
      <DialogContent>
        {isFetching ? (
          <LinearProgress />
        ) : (
          reportData && (
            <>
              {(belowLargeScreen && activeTab === 0) ?
                <TrialBalanceOnScreen
                  reportData={reportData}
                  authOrganization={authOrganization}
                /> :
                <PDFContent
                  document={<ReportDocumet reportData={reportData} authOrganization={authOrganization} user={user}/>}
                  fileName={downloadFileName}
                />
              }
            </>
          )
        )}
      </DialogContent>
    </>
  )
}

export default TrialBalance