import { Alert, Box, Chip, Grid, LinearProgress, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import BudgetItemsActionTail from './BudgetItemsActionTail';
import { useQuery } from 'react-query';
import projectsServices from '../../projectsServices';
import { useCurrencySelect } from 'app/prosServices/prosERP/masters/Currencies/CurrencySelectProvider';
import LedgerSelect from 'app/prosServices/prosERP/accounts/ledgers/forms/LedgerSelect';

function BudgetsAccordionDetails({ budget, expanded }) {
    const { currencies } = useCurrencySelect();
    const baseCurrency = currencies.find(c => c.is_base === 1);
    const [searchQueryNames, setSearchQueryNames] = useState([]);

    const { data: budgetItemsDetails, isLoading } = useQuery(
        ['budgetItemsDetails', { id: budget.id }],
        async () => projectsServices.getbudgetItemsDetails(budget.id),
        {
            enabled: !!expanded,
        }
    );

    const getPercentageColor = (percentage) => {
        if (percentage <= 50) return 'success';
        if (percentage > 50 && percentage < 75) return 'warning';
        return 'error';
    };

    const filteredExpenses = budgetItemsDetails?.expenses_budgeted?.filter(expense =>
        searchQueryNames.length === 0 || searchQueryNames.includes(expense.name)
    );  

   const totalBudgetedAmount = !!filteredExpenses && filteredExpenses?.reduce((total, item) => total + item?.budgeted, 0);
   const totalSpentAmount = !!filteredExpenses && filteredExpenses?.reduce((total, item) => total + item?.spent, 0);

    return (
        <>
            {isLoading ? (
                <Grid container>
                    <Grid item xs={12}>
                        <LinearProgress />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={1}>

                    <Grid item xs={12} container spacing={2} justifyContent="flex-end">
                        <Grid item xs={12} md={6} textAlign="end">
                            <LedgerSelect
                                multiple={true}
                                label="Filter by Expense"
                                allowedGroups={['Expenses']}
                                onChange={(newValue) => { 
                                    setSearchQueryNames(newValue.map(ledger => ledger.name));
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={0.5} textAlign="end">
                            <BudgetItemsActionTail budget={budgetItemsDetails} />
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12} container spacing={2} paddingBottom={1}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" color="textSecondary">
                                Total Budgeted
                            </Typography>
                            <Typography variant="h5">
                                {totalBudgetedAmount.toLocaleString('en-US', { style: 'currency', currency: baseCurrency?.code })}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" color="textSecondary">
                                Total Spent
                            </Typography>
                            <Typography variant="h5">
                                {totalSpentAmount.toLocaleString('en-US', { style: 'currency', currency: baseCurrency?.code })}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" color="textSecondary">
                                Percentage Spent
                            </Typography>
                            <Typography variant="h5">
                                {(totalSpentAmount / totalBudgetedAmount * 100).toFixed(2)}%
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} paddingTop={1}>
                        {filteredExpenses?.length > 0 ? filteredExpenses.map((item, index) => {
                            const percentageSpent = (item?.spent / item?.budgeted) * 100;

                            return (
                                <Grid
                                    key={index}
                                    sx={{
                                        cursor: 'pointer',
                                        borderTop: 1,
                                        borderColor: 'divider',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                        padding: 1,
                                    }}
                                    container
                                    columnSpacing={2}
                                    alignItems="center"
                                >
                                    <Grid item xs={7} md={5.7} lg={5.7}>
                                        <Tooltip title="Name">
                                            <Typography variant="h6">{item?.name}</Typography>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={5} md={2.3} lg={2.3}>
                                        <Tooltip title="Budgeted">
                                            <Typography variant="h6">
                                                {item?.budgeted.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: baseCurrency?.code,
                                                })}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={8} md={2} lg={2}>
                                        <Tooltip title="Spent">
                                            <Typography variant="h6">
                                                {item?.spent.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: baseCurrency?.code,
                                                })}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={4} md={2} lg={2}>
                                        <Tooltip title="Percentage Spent">
                                            <Chip
                                                label={`${percentageSpent.toLocaleString('en-US', {
                                                    maximumFractionDigits: 3,
                                                    minimumFractionDigits: 3,
                                                })}%`}
                                                color={getPercentageColor(percentageSpent)}
                                                size="small"
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} paddingTop={1}>
                                        <Tooltip title="Percentage Spent">
                                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentageSpent}
                                                    color={getPercentageColor(percentageSpent)}
                                                    sx={{ height: 15, borderRadius: 5 }}
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }) : (
                            <Alert variant="outlined" color="primary" severity="info">No expenses budgeted found</Alert>
                        )}
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export default BudgetsAccordionDetails;
