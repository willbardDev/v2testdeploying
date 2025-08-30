import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Grid,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  DialogTitle,
  Autocomplete,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import Div from '@jumbo/shared/Div/Div';
import { useProjectProfile } from '../ProjectProfileProvider';
import projectsServices from '../../projectsServices';
import CurrencySelector from 'app/prosServices/prosERP/masters/Currencies/CurrencySelector';
import CommaSeparatedField from 'app/shared/Inputs/CommaSeparatedField';
import { sanitizedNumber } from 'app/helpers/input-sanitization-helpers';
import MeasurementSelector from 'app/prosServices/prosERP/masters/measurementUnits/MeasurementSelector';

const DeliverablesForm = ({ setOpenDialog, group=null, deliverable=null }) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const {project, deliverable_groups} = useProjectProfile();

    const { mutate: addDeliverables, isLoading } = useMutation(projectsServices.addDeliverables, {
        onSuccess: (data) => {
            setOpenDialog(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['projectDeliverableGroups']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response.data.message, {
                variant: 'error',
            });
        },
    });

    const { mutate: updateDeliverables, isLoading: updateIsLoading } = useMutation(projectsServices.updateDeliverables, {
        onSuccess: async(data) => {
            await setOpenDialog(false);
            enqueueSnackbar(data.message, { variant: 'success' });
            queryClient.invalidateQueries(['projectDeliverableGroups']);
        },
        onError: (error) => {
            enqueueSnackbar(error.response.data.message, {
                variant: 'error',
            });
        },
    });

    const saveMutation = React.useMemo(() => {
        return deliverable ? updateDeliverables : addDeliverables;
    }, [addDeliverables, updateDeliverables, deliverable]);

    const toOptions = (groups, depth = 0) => {
        if (!Array.isArray(groups)) {
          return [];
        }
      
        return groups.flatMap(group => {
          const { children, deliverables } = group;
      
          const deliverableOptions = (deliverables || []).map(deliverable => ({
            description: `After: ${deliverable.description}`,
            id: deliverable.id,
            position_index: deliverable.position_index,
            weighted_percentage: deliverable.weighted_percentage,
            project_deliverable_group_id: deliverable.project_deliverable_group_id,
          }));
      
          const groupChildren = toOptions(children, depth + 1);
      
          return [...deliverableOptions, ...groupChildren];
        });
    };
      
    const deliverables = toOptions(deliverable_groups);

    const sameLevelDeliverables = deliverables.filter(delgroup => 
        delgroup.project_deliverable_group_id === (group ? group.id : deliverable ? deliverable?.project_deliverable_group_id : null)
    )
        
    const positionIndexOptions = [
        { description: 'At the beginning', position_index: null, id: null }, 
        ...sameLevelDeliverables
    ];

    const validationSchema = yup.object({
        description: yup.string().required("Description is required").typeError('Description is required'),
        measurement_unit_id: yup.number().required("Measurement Unit is required").typeError('Measurement Unit is required'),
        quantity: yup.number().required("Quantity is required").typeError('Quantity is required'),
        weighted_percentage: yup
            .number()
            .nullable()
            .notRequired()
            .min(1, 'Weight Percentage must be greater than 0')
            .max(100, "Weight Percentage must be less than or equal to 100")
            .test('check-total', function (value) {
                const context = this.options.context || {};
                const { sameLevelDeliverables, deliverable } = context;
    
                if (!sameLevelDeliverables) return true;
    
                const totalWeightPercentages = sameLevelDeliverables.reduce(
                    (total, del) => total + (deliverable && del.position_index === deliverable.position_index ? 0 : del.weighted_percentage),
                    0
                );
    
                if ((totalWeightPercentages + value) > 100) {
                    return this.createError({
                        message: `Total percentage should not exceed 100%. You currently have ${totalWeightPercentages}% allocated.`,
                    });
                }
                return true;
            }),
        contract_rate: yup.number().when('client_id', {
            is: (client_id) => !!client_id,
            then: yup.number().required("Contract rate is required").typeError('Contract rate is required'),
            otherwise: yup.number(),
        }),
    });         

    const { register, setValue, watch, clearErrors, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            id: deliverable?.id,
            name: deliverable?.name,
            description: deliverable?.description,
            measurement_unit_id: deliverable?.measurement_unit_id,
            quantity: deliverable?.quantity,
            contract_rate: deliverable?.contract_rate,
            currency_id: deliverable ? deliverable?.currency_id : 1,
            exchange_rate: deliverable ? deliverable?.exchange_rate : 1,
            weighted_percentage: deliverable?.weighted_percentage,
            project_deliverable_group_id: deliverable ? deliverable.project_deliverable_group_id : group?.id,
            position_index: deliverable?.position_index,
            client_id: project?.client_id || null,
        },
        context: { sameLevelDeliverables, deliverable }
    });

    return (
        <> 
            <DialogTitle textAlign={'center'}>{deliverable ? `Edit Deliverable` : `Add ${group?.name} Deliverable`}</DialogTitle>
            <DialogContent>
                <form autoComplete="off">
                    <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                            <Div sx={{ mt: 1}}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    multiline={true}
                                    rows={2}
                                    label="Description"
                                    error={!!errors?.description}
                                    helperText={errors?.description?.message}
                                    {...register(`description`)}
                                />
                            </Div>
                        </Grid>
                        <Grid item md={4} xs={12} >
                            <Div sx={{ mt: 1}}>
                                <TextField
                                    size='small'
                                    defaultValue={deliverable?.code}
                                    label='Code'
                                    fullWidth
                                    {...register('code')}
                                />
                            </Div>
                        </Grid>
                        {!!project.client_id &&
                            <>
                                <Grid item md={4} xs={12}>
                                    <Div sx={{ mt: 1}}>
                                        <CurrencySelector
                                            frontError={errors?.currency_id}
                                            defaultValue={deliverable ? deliverable.currency_id : 1}
                                            onChange={(newValue) => {
                                                setValue('currency_id', newValue ? newValue.id : null, {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                            });

                                            clearErrors('exchange_rate');

                                            setValue('exchange_rate', newValue?.exchangeRate ? newValue.exchangeRate : 1);
                                            }}
                                        />
                                    </Div>
                                </Grid>
                                {
                                    watch('currency_id') > 1 && (
                                        <Grid item md={4} xs={12}>
                                            <Div sx={{ mt: 1}}>
                                                <TextField
                                                    label="Exchange Rate"
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        inputComponent: CommaSeparatedField,
                                                    }}
                                                    value={watch('exchange_rate')}
                                                    onChange={(e) => {
                                                        setValue(`exchange_rate`, e.target.value ? sanitizedNumber(e.target.value) : null, {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        });
                                                    }}
                                                />
                                            </Div>
                                        </Grid>
                                    )
                                }
                            </>
                        }
                        <Grid item xs={12} md={4}>
                            <Div sx={{ mt: 1}}>
                                <MeasurementSelector
                                    label='Measurement Unit'
                                    frontError={errors && errors?.measurement_unit_id}
                                    defaultValue={deliverable?.measurement_unit_id}
                                    onChange={(newValue) => {
                                        newValue ? setValue(`measurement_unit_id`, newValue.id,{
                                            shouldDirty: true,
                                            shouldValidate: true
                                        }) : setValue(`measurement_unit_id`,'',{
                                            shouldDirty: true,
                                            shouldValidate: true
                                        });
                                    }}      
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Div sx={{ mt: 1}}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    error={errors && !!errors?.quantity}
                                    helperText={errors && errors.quantity?.message}
                                    label="Quantity"
                                    {...register(`quantity`)}
                                />
                            </Div>
                        </Grid>
                        {!!project.client_id &&
                            <Grid item xs={12} md={4}>
                                <Div sx={{ mt: 1}}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Contract Rate"
                                        defaultValue={deliverable?.contract_rate}
                                        error={!!errors?.contract_rate}
                                        helperText={errors?.contract_rate?.message}
                                        InputProps={{
                                            inputComponent: CommaSeparatedField,
                                        }}
                                        onChange={(e) => {
                                            setValue(`contract_rate`,e.target.value ? sanitizedNumber(e.target.value ): 0,{
                                                shouldValidate: true,
                                                shouldDirty: true
                                            });
                                        }}
                                    />
                                </Div>
                            </Grid>
                        }
                        <Grid item xs={12} md={4}>
                            <Div sx={{ mt: 1}}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    defaultValue={deliverable?.weighted_percentage}
                                    error={!!errors?.weighted_percentage}
                                    helperText={errors?.weighted_percentage?.message}
                                    label="Weighted Percentage"
                                    InputProps={{
                                        endAdornment: <span>%</span>
                                    }}
                                    onChange={(e) => {

                                        setValue("weighted_percentage",e.target.value ? sanitizedNumber(e.target.value) : 0,{
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                />
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={watch('currency_id') > 1 ? 8 : !project.client_id && 8 }>
                            <Div sx={{ mt: 1}}>
                                <Autocomplete
                                    options={deliverable ? 
                                        positionIndexOptions.filter(group => group.position_index !== deliverable?.position_index) : // for edit deliverable
                                        positionIndexOptions
                                    }
                                    isOptionEqualToValue={(option,value) => option.id === value.id}
                                    getOptionLabel={(option) => option.description}
                                    renderInput={
                                        (params) => 
                                        <TextField 
                                            {...params} 
                                            label="Position" 
                                            size="small" 
                                            fullWidth
                                        />
                                    }
                                    onChange={(e, newValue) => {
                                        setValue(`position_index`, newValue && newValue?.position_index + 1 , {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                            </Div>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button size="small" onClick={() => setOpenDialog(false)}>
                    Cancel
                </Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit(saveMutation)}
                    size="small"
                    sx={{ display: 'flex' }}
                    loading={isLoading || updateIsLoading}
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </>
    );
};

export default DeliverablesForm;
