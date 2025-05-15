import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div/Div';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, Tab, Tabs } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ledgerServices from '../../ledger-services';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import pdfStyles from 'app/prosServices/prosERP/pdf/pdf-styles';
import PageFooter from 'app/prosServices/prosERP/pdf/PageFooter';
import PdfLogo from 'app/prosServices/prosERP/pdf/PdfLogo';
import PDFContent from 'app/prosServices/prosERP/pdf/PDFContent';
import CostCenterSelector from 'app/prosServices/prosERP/masters/costCenters/CostCenterSelector';
import { PERMISSIONS } from 'app/utils/constants/permissions';
import { deviceType } from 'app/helpers/user-agent-helpers';
import LedgerStatementOnScreen from './LedgerStatementOnScreen';

const ReportDocument = ({ transactionsData, authOrganization, user, ledger, ledgerName }) => {
    const totalCredits = transactionsData.transactions.reduce((total, transaction) => total + transaction.credit, 0);
    const totalDebits = transactionsData.transactions.reduce((total, transaction) => total + transaction.debit, 0);
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";
    const costCenters = transactionsData.filters.cost_centers;

    let cumulativeBalance = 0;

    return transactionsData ? (
        <Document
            creator={`${user.name} | Powered by ProsERP`}
            producer='ProsERP'
            title={`${ledger?.name || ledgerName} Statement ${readableDate(transactionsData.filters.from)} to ${readableDate(transactionsData.filters.to)}`}
        >
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.table}>
                    <View style={{ ...pdfStyles.tableRow, marginBottom: 20 }}>
                        <View style={{ flex: 1, maxWidth: 120 }}>
                            <PdfLogo organization={authOrganization.organization} />
                        </View>
                        <View style={{ flex: 1, textAlign: 'right' }}>
                            <Text style={{ ...pdfStyles.majorInfo, color: mainColor }}>{`Ledger Statement`}</Text>
                            <Text style={{ ...pdfStyles.midInfo }}>{`${ledger?.name || ledgerName}`}</Text>
                            <Text style={{ ...pdfStyles.minInfo }}>{`${readableDate(transactionsData.filters.from, true)} - ${readableDate(transactionsData.filters.to, true)}`}</Text>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow, marginTop: 10 }}>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ ...pdfStyles.minInfo, color: mainColor }}>Total Credits</Text>
                            <Text style={{ ...pdfStyles.minInfo }}>{totalCredits.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ ...pdfStyles.minInfo, color: mainColor }}>Total Debits</Text>
                            <Text style={{ ...pdfStyles.minInfo }}>{totalDebits.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ ...pdfStyles.minInfo, color: mainColor }}>Printed By</Text>
                            <Text style={{ ...pdfStyles.minInfo }}>{user.name}</Text>
                        </View>
                        <View style={{ flex: 1, padding: 2 }}>
                            <Text style={{ ...pdfStyles.minInfo, color: mainColor }}>Printed On</Text>
                            <Text style={{ ...pdfStyles.minInfo }}>{readableDate(undefined, true)}</Text>
                        </View>
                    </View>
                    <View style={{ ...pdfStyles.tableRow, marginBottom: 2 }}>
                        {Array.isArray(costCenters) && costCenters.length > 0 && (
                            <View style={{ flex: 2, padding: 2 }}>
                                <Text style={{ ...pdfStyles.minInfo, color: mainColor }}>Cost Centers</Text>
                                <Text style={{ ...pdfStyles.minInfo }}>{costCenters.map((cost_centers) => cost_centers.name).join(', ')}</Text>
                            </View>
                        )}
                    </View>
                    <View style={pdfStyles.tableRow}>
                        <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1.5 }}>Date</Text>
                        <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Reference</Text>
                        <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 2 }}>Description</Text>
                        <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Debit</Text>
                        <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1 }}>Credit</Text>
                        <Text style={{ ...pdfStyles.tableHeader, backgroundColor: mainColor, color: contrastText, flex: 1.5 }}>Balance</Text>
                    </View>
                    {transactionsData.transactions.map((transaction, index) => {
                        cumulativeBalance +=
                            ledger?.increasesWith === 'DR'
                                ? transaction.debit - transaction.credit
                                : transaction.credit - transaction.debit;

                        // Fix for -0.00 display issue
                        const formattedBalance = cumulativeBalance.toLocaleString('en-US', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        });
                        const displayBalance = formattedBalance === "-0.00" ? "0.00" : formattedBalance;

                        return (
                            <View key={index} style={pdfStyles.tableRow}>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1.5 }}>{readableDate(transaction.transactionDate)}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1 }}>{transaction.voucherNo ? transaction.voucherNo : ''}{' '}{transaction.reference ? transaction.reference : ''}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 2 }}>{transaction.description}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1, textAlign: 'right' }}>{transaction.debit !== 0 && transaction.debit.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1, textAlign: 'right' }}>{transaction.credit !== 0 && transaction.credit.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Text>
                                <Text style={{ ...pdfStyles.tableCell, backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor, flex: 1.5, textAlign: 'right' }}>{displayBalance}</Text>
                            </View>
                        );
                    })}
                </View>
                <PageFooter />
            </Page>
        </Document>
    ) : '';
};

function LedgerStatementDialogContent({ setOpen, ledger, incomeStatementfilters = null }) {
    const [transactions, setTransactions] = useState(null);
    const { authOrganization, authUser: { user }, checkOrganizationPermission } = useJumboAuth();
    const [withItemDescription, setWithItemDescription] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const isMobile = deviceType() === 'mobile';

    const { setValue, handleSubmit, watch } = useForm({
        defaultValues: {
            from: dayjs().startOf('day').toISOString(),
            to: dayjs().endOf('day').toISOString(),
            ledger_id: ledger && ledger.id,
            cost_center_ids: checkOrganizationPermission(PERMISSIONS.COST_CENTERS_ALL) ? 'all' : authOrganization.costCenters.map(cost_center => cost_center.id),
            with_item_description: withItemDescription
        }
    });

    const [today] = useState(dayjs());
    const [isFetching, setIsFetching] = useState(false);

    const fetchTransactions = useCallback(async (filters) => {
        try {
            setIsFetching(true);
            const data = await ledgerServices.statement(filters);
            setTransactions(data);
        } catch (err) {
            setTransactions(null);
        } finally {
            setIsFetching(false);
        }
    }, []);

    // Initial data load
    useEffect(() => {
        if (incomeStatementfilters) {
            fetchTransactions(incomeStatementfilters);
        }
    }, [incomeStatementfilters, fetchTransactions]);

    const ledgerName = incomeStatementfilters?.ledgerName;
    const downloadFileName = `${ledger?.name || ledgerName} Statement ${readableDate(watch('from'))}-${readableDate(watch('to'))}`;

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <React.Fragment>
            <DialogTitle textAlign={'center'}>
                <form autoComplete='off' onSubmit={handleSubmit(fetchTransactions)}>
                    <Grid container columnSpacing={1} rowSpacing={1} alignItems={'center'} justifyContent={'center'}>
                        {!incomeStatementfilters && (
                            <>
                                <Grid item xs={12} mb={2}>{ledger && ledger.name + ' statement'}</Grid>
                                {!ledger && (
                                    <Grid item xs={12} md={4}>
                                        <Div sx={{ mt: 1, mb: 1 }}></Div>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={10} lg={6}>
                                    <CostCenterSelector
                                        label="Cost Centers"
                                        multiple={true}
                                        allowSameType={true}
                                        onChange={(cost_centers) => {
                                            setValue('cost_center_ids', cost_centers.map((cost_center) => cost_center.id));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Div sx={{ mt: 1, mb: 1 }}>
                                        <DateTimePicker
                                            label="From (MM/DD/YYYY)"
                                            fullWidth
                                            minDate={dayjs(authOrganization.organization.recording_start_date)}
                                            defaultValue={today.startOf('day')}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                }
                                            }}
                                            onChange={(newValue) => {
                                                setValue('from', newValue ? newValue.toISOString() : null, {
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });
                                            }}
                                        />
                                    </Div>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Div sx={{ mt: 1, mb: 1 }}>
                                        <DateTimePicker
                                            label="To (MM/DD/YYYY)"
                                            fullWidth
                                            minDate={dayjs(watch('from'))}
                                            defaultValue={today.endOf('day')}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true
                                                }
                                            }}
                                            onChange={(newValue) => {
                                                setValue('to', newValue ? newValue.toISOString() : null, {
                                                    shouldValidate: true,
                                                    shouldDirty: true
                                                });
                                            }}
                                        />
                                    </Div>
                                </Grid>
                                <Grid item xs={12} md={11}>
                                    <Div sx={{ mt: 1, mb: 1 }}>
                                        <Checkbox
                                            checked={withItemDescription}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setWithItemDescription(isChecked);
                                                setValue('with_item_description', isChecked, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                            }}
                                        />
                                        With Items Description
                                    </Div>
                                </Grid>
                                <Grid item xs={12} md={1} textAlign={'right'}>
                                    <LoadingButton loading={isFetching} type='submit' size='small' variant='contained'>
                                        Filter
                                    </LoadingButton>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            {transactions && isMobile && (
                                <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                                    <Tab label="On-Screen" />
                                    <Tab label="PDF" />
                                </Tabs>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </DialogTitle>
            <DialogContent>
                {isFetching ? (
                    <LinearProgress />
                ) : (
                    transactions && (
                        <>
                            {(isMobile && activeTab === 0) ?
                                <LedgerStatementOnScreen
                                    transactionsData={transactions}
                                    authOrganization={authOrganization}
                                    ledger={ledger}
                                /> :
                                <PDFContent
                                    document={
                                        <ReportDocument transactionsData={transactions} authOrganization={authOrganization} user={user} ledger={ledger} ledgerName={ledgerName} />
                                    }
                                    fileName={downloadFileName}
                                />
                            }
                        </>
                    )
                )}
            </DialogContent>
            <DialogActions>
                <Button size='small' variant='outlined' onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default LedgerStatementDialogContent;