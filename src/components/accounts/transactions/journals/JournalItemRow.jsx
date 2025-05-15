import { DisabledByDefault, EditOutlined } from '@mui/icons-material';
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import JournalItemForm from './JournalItemForm';

function JournalItemRow({ setClearFormKey, submitMainForm, setSubmitItemForm, submitItemForm, setIsDirty, item, index, items = [], setItems }) {
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
                    
                    <Grid item xs={6} md={3} lg={3}>
                        <Tooltip title="Debit">
                            <Typography>{debit_ledger?.name || item.debitLedgerName}</Typography>
                        </Tooltip>
                    </Grid>
                    
                    <Grid item xs={6} md={3} lg={3}>
                        <Tooltip title="Credit">
                            <Typography>{credit_ledger?.name || item.creditLedgerName}</Typography>
                        </Tooltip>
                    </Grid>
                    
                    <Grid item xs={6} md={4} lg={2.5}>
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
                <JournalItemForm
                    item={item}
                    submitMainForm={submitMainForm} 
                    setClearFormKey={setClearFormKey}
                    setSubmitItemForm={setSubmitItemForm} 
                    submitItemForm={submitItemForm}
                    setIsDirty={setIsDirty}
                    setShowForm={setShowForm}
                    index={index}
                    items={items}
                    setItems={setItems}
                />
            )}
        </React.Fragment>
    );
}

export default JournalItemRow;
