import { DialogContent, DialogTitle, Grid, LinearProgress, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import financialReportsServices from '../financial-reports-services';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';
import pdfStyles from '@/components/pdf/pdf-styles';
import PdfLogo from '@/components/pdf/PdfLogo';
import useProsERPStyles from '@/app/helpers/style-helpers';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Div, Span } from '@jumbo/shared';
import CostCenterSelector from '@/components/masters/costCenters/CostCenterSelector';
import PDFContent from '@/components/pdf/PDFContent';

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
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Code</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 3 }}>Description</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Debit</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Credit</Text>
              </View>

              {
                reportData.trial_balance.filter(tb => tb.amount !== 0).map((tb,index) => (

                    <View key={index} style={pdfStyles.tableRow}>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1 }}>{tb.code}</Text>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 3 }}>{tb.description}</Text>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1,textAlign: 'right' }}>{tb.balance_side === 'DR' && tb.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                        <Text style={{ ...pdfStyles.tableCell,backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1,textAlign: 'right' }}>{tb.balance_side === 'CR' && tb.amount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                    </View>
                ))
              }
              <View style={pdfStyles.tableRow}>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 4.2 }}>TOTAL</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,textAlign: 'right', flex: 1 }}>{reportData.trial_balance.filter(tb => tb.balance_side === 'DR').reduce((totalDebits,tb) => totalDebits + tb.amount,0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
                <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText,textAlign: 'right', flex: 1 }}>{reportData.trial_balance.filter(tb => tb.balance_side === 'CR').reduce((totalCredits,tb) => totalCredits + tb.amount,0).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</Text>
              </View>
          </View>
        </Page>
      </Document>
    ) : ''
}

function CodedTrialBalance() {
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
          cost_center_ids: checkOrganizationPermission(PERMISSIONS.COST_CENTERS_ALL) ? 'all' : authOrganization?.costCenters.map(cost_center => cost_center.id)
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
        const report = await financialReportsServices.codedTrialBalance(filters);
        
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
              <Grid size={{xs: 12, md: 10, lg: 5}}>
                <CostCenterSelector
                  label="Cost Centers"
                  multiple={true}
                  defaultValue={authOrganization?.costCenters}
                  allowSameType={true}
                  onChange={(cost_centers) => {
                    setValue('cost_center_ids', cost_centers.map((cost_center) => cost_center.id));
                  }}
                />
              </Grid>
              <Grid size={{xs: 12, md: 4, lg: 3}}>
                <Div sx={{ mt: 1, mb: 1 }}>
                  <DateTimePicker
                    label="As at (MM/DD/YYYY)"
                    defaultValue={dayjs()}
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
              {
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

export default CodedTrialBalance