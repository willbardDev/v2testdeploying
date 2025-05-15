import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import TransactionItemForm from './TransactionItemForm';

function TransactionItemRow({ setClearFormKey, submitMainForm, setSubmitItemForm, submitItemForm, setIsDirty, isReceipt, isPayment, isTransfer, item, index, items = [], setItems }) {
    const debit_ledger = item.debit_ledger && item.debit_ledger;
    const credit_ledger = item.credit_ledger && item.credit_ledger;
    const [showForm, setShowForm] = useState(false);

    return (
        <React.Fragment>
            <Divider />
            {!showForm ? (
                <Grid container
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        }
                    }}
                >
                    <Grid item xs={1} md={0.5}>
                        {index + 1}.
                    </Grid>
                    
                    {/* Conditional Rendering Based on Transaction Type */}
                    {(isPayment || isTransfer) && (
                        <Grid item xs={6} md={(isPayment || isTransfer) ? 4 : 3} lg={(isPayment || isTransfer) ? 4 : 3}>
                            <Tooltip title="Debit">
                                <Typography>{debit_ledger?.name || item.debitLedgerName}</Typography>
                            </Tooltip>
                        </Grid>
                    )}
                    
                    {(isReceipt) && (
                        <Grid item xs={6} md={(isReceipt) ? 4 : 3} lg={(isReceipt) ? 4 : 3}>
                            <Tooltip title="Credit">
                                <Typography>{credit_ledger?.name || item.creditLedgerName}</Typography>
                            </Tooltip>
                        </Grid>
                    )}
                    
                    <Grid item xs={6} md={4} lg={4.3}>
                        <Tooltip title="Description">
                            <Typography>{item.description}</Typography>
                        </Tooltip>
                    </Grid>
                    
                    <Grid item xs={6} md={3} lg={2}>
                        <Tooltip title="Amount">
                            <Typography textAlign={'right'}>{item.amount.toLocaleString()}</Typography>
                        </Tooltip>
                    </Grid>
                    
                    <Grid textAlign={'end'} item xs={12} md={12} lg={1}>
                        <Tooltip title='Edit Item'>
                            <IconButton size='small' onClick={() => { setShowForm(true) }}>
                                <EditOutlined fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Remove Item'>
                            <IconButton size='small'
                                onClick={() => setItems(items => {
                                    const newItems = [...items];
                                    newItems.splice(index, 1);
                                    return newItems;
                                })}
                            >
                                <DisabledByDefault fontSize='small' color='error' />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            ) : (
                <TransactionItemForm
                    setClearFormKey={setClearFormKey}
                    isPayment={isPayment}
                    submitMainForm={submitMainForm} 
                    setSubmitItemForm={setSubmitItemForm} 
                    submitItemForm={submitItemForm} 
                    setIsDirty={setIsDirty}
                    isTransfer={isTransfer}
                    isReceipt={isReceipt}
                    item={item}
                    setShowForm={setShowForm}
                    index={index}
                    items={items}
                    setItems={setItems}
                />
            )}
        </React.Fragment>
    );
}

export default TransactionItemRow;
