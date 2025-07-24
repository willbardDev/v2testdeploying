import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import CostCenterSelector from '@/components/masters/costCenters/CostCenterSelector';
import CurrencySelector from '@/components/masters/Currencies/CurrencySelector';
import StakeholderQuickAdd from '@/components/masters/stakeholders/StakeholderQuickAdd';
import StakeholderSelector from '@/components/masters/stakeholders/StakeholderSelector';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { Div } from '@jumbo/shared';
import { AddOutlined } from '@mui/icons-material';
import { Grid, TextField, Tooltip } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';

function ApprovedPurchaseTopInformation() {
    const {setAddedStakeholder, addedStakeholder, setStakeholderQuickAddDisplay, order, approvedRequisition, order_date, setValue, stakeholderQuickAddDisplay, errors, approvedDetails, watch, register} = useFormContext();
    const {authOrganization,checkOrganizationPermission} = useJumboAuth();
    const cp = {id:null,name: 'Cash Purchase'};

    // setvalues from coming addedStakeholder
    useEffect(() => {
        if(addedStakeholder?.id){
            setValue('stakeholder_id', addedStakeholder.id);
            setValue('tin', addedStakeholder.tin, {
                shouldTouch: true,
            });
            setValue('vrn', addedStakeholder.vrn);
            setStakeholderQuickAddDisplay(false)
        }
    }, [addedStakeholder])
    
  return (
    <Grid container columnSpacing={1} rowSpacing={2}>
        <Grid item xs={12} md={4} lg={4}>
            <Div sx={{mt: 0.3}}>
                <DateTimePicker
                    fullWidth={true}
                    label="Order Date"
                    minDate={checkOrganizationPermission(PERMISSIONS.PURCHASES_BACKDATE) ? dayjs(authOrganization?.organization.recording_start_date) : dayjs().startOf('day')}
                    maxDate={checkOrganizationPermission(PERMISSIONS.PURCHASES_POSTDATE) ? dayjs().add(10,'year').endOf('year') : dayjs().endOf('day')}
                    defaultValue={order_date}
                    slotProps={{
                        textField : {
                            size: 'small',
                            fullWidth: true,
                            readOnly: true,
                            error: !!errors?.order_date,
                            helperText: errors?.order_date?.message
                        }
                    }}
                    onChange={(newValue) => {
                        setValue('order_date', newValue ? newValue.toISOString() : null,{
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    }}
                />
            </Div>
        </Grid>
        { !stakeholderQuickAddDisplay && 
            <Grid item xs={12} md={8} lg={8}>
                <Div sx={{ mt: 0.3 }}>
                    <StakeholderSelector
                        label='Supplier'
                        frontError={errors?.stakeholder_id}
                        initialOptions={[cp]}
                        defaultValue={order && order.stakeholder.id}
                        addedStakeholder={addedStakeholder}
                        onChange={(newValue) => {
                            setValue('stakeholder_id', newValue ? newValue.id: null,{
                                shouldDirty: true,
                                shouldValidate: true
                            });
                            setValue('tin', newValue ? newValue.tin : null,{
                                shouldTouch:true,
                            });
                            setValue('vrn', newValue ? newValue.vrn : null);
                            setValue('instant_pay', !newValue?.id ? true : false);
                            setValue('instant_receive', !newValue?.id ? true : false);
                            if(!newValue?.id){
                                setValue('instant_invoice',false,{
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                            }
                        }}
                        startAdornment= {
                            <Tooltip title={'Add Supplier'}>
                                <AddOutlined
                                    onClick={() => setStakeholderQuickAddDisplay(true)}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                />
                            </Tooltip>
                        }
                    />
                </Div>
            </Grid>
        }

        {!!stakeholderQuickAddDisplay && <StakeholderQuickAdd setStakeholderQuickAddDisplay={setStakeholderQuickAddDisplay} create_payable={true} setAddedStakeholder={setAddedStakeholder}/>} 

        <Grid item xs={12}>
            <Grid container rowSpacing={2} columnSpacing={1}>
                <Grid item  md={4} lg={4} xs={12} >
                    <Div sx={{mt: 0.3}}>
                        <TextField
                            size='small'
                            label='Reference'
                            fullWidth
                            error={!!errors?.reference}
                            helperText={errors?.reference?.message}
                            {...register('reference')}
                        />
                    </Div>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Div sx={{mt: 0.3}}>
                        <DateTimePicker
                            fullWidth={true}
                            label="Date required"
                            defaultValue={order && dayjs(order.date_required)}
                            minDate={dayjs(order_date)}
                            slotProps={{
                                textField : {
                                    size: 'small',
                                    fullWidth: true,
                                    readOnly: true,
                                    error: !!errors?.order_date,
                                    helperText: errors?.order_date?.message
                                }
                            }}
                            onChange={(newValue) => {
                                setValue('date_required', newValue ? newValue.toISOString() : null,{
                                    shouldValidate: true,
                                    shouldDirty: true
                                });
                            }}
                        />
                    </Div>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Div sx={{mt: 0.3}}>
                        <CurrencySelector
                            defaultValue={approvedDetails && approvedDetails.currency.id}
                            disabled={true}
                        />
                    </Div>
                </Grid>
                {
                   watch(`currency_id`) > 1 &&
                    <Grid item xs={12}  md={4} lg={4}>
                        <Div sx={{mt: 0.3}}>
                            <TextField
                                label="Exchange Rate"
                                fullWidth
                                size='small'
                                InputProps={{
                                    inputComponent: CommaSeparatedField,
                                }}
                                value={watch('exchange_rate')}
                                disabled={true}
                            />
                        </Div>
                    </Grid>
                }
                <Grid item xs={12} md={watch(`currency_id`) > 1 ? 8 : 12}>
                    <Div sx={{mt: 0.3}}>
                        <CostCenterSelector
                            multiple={true}
                            allowSameType={false}
                            defaultValue={approvedRequisition ? [approvedRequisition.requisition.cost_center] : order.cost_centers}
                            disabled={true}
                        />
                    </Div>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  )
}

export default ApprovedPurchaseTopInformation