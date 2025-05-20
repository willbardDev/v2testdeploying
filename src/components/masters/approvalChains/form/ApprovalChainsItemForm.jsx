import { yupResolver } from '@hookform/resolvers/yup';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div/Div';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { Autocomplete, Button, Checkbox, Grid, IconButton, LinearProgress, TextField, Tooltip} from '@mui/material';
import organizationServices from 'app/prosServices/prosERP/organizations/organizationServices';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import * as yup from "yup";

function ApprovalChainsItemForm({ setClearFormKey, submitMainForm, submitItemForm, setSubmitItemForm, setIsDirty, item = null, index = -1, setItems, items = [], setShowForm = null}) {
    const {authOrganization} = useJumboAuth();
    const [can_finalize, setCan_finalize] = useState(item?.can_finalize === 1 ? true : false);
    const [can_override, setCan_override] = useState(item?.can_override === 1 ? true : false);

    const validationSchema = yup.object({
        label: yup.string().required('Label is required').typeError('Label is required'),
        role_id: yup.string().required('Role is required').typeError('Role is required'),
    });

    const { setValue, register, watch, handleSubmit, reset, formState: { errors, dirtyFields } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            can_finalize: item ? item.can_finalize : 0,
            can_override: item ? item.can_override : 0,
            label: item && item.label,
            remarks: item && item.remarks,
            role_id: item && item.role_id,
            role: item && item.role,
        }
    });

    useEffect(() => {
        setIsDirty(Object.keys(dirtyFields).length > 0); // Update dirty state
    }, [dirtyFields, setIsDirty, watch]);

    const [isAdding, setIsAdding] = useState(false); 

    const updateItems = async (item) => {
        setIsAdding(true);
        if (index > -1) {
            // Replace the existing item with the edited item
            let updatedItems = [...items];
            updatedItems[index] = item;
            await setItems(updatedItems);
            setClearFormKey(prevKey => prevKey + 1);
        } else {
            // Add the new item to the items array
            await setItems((items) => [...items, item]);
            if (!!submitItemForm) {
                submitMainForm()
            }
            setSubmitItemForm(false);
            setClearFormKey(prevKey => prevKey + 1);
        }

        reset();
        setIsAdding(false);
        setShowForm && setShowForm(false);
    };

    useEffect(() => {
      if (submitItemForm) {
        handleSubmit(updateItems, () => {
          setSubmitItemForm(false); // Reset submitItemForm if there are errors
        })();
      }
    }, [submitItemForm]);

    const { data: roles, isLoading: isLoadingRoles, isFetching: isFetchingRoles } = useQuery(`organizationRoles_${authOrganization.organization.id}`, async () => organizationServices.roles(authOrganization.organization?.id), 
      {
        enabled: !item, 
      }
    );

    if (isAdding) {
      return <LinearProgress/>
    }

  return (
    <form 
      autoComplete='off' 
      onSubmit={handleSubmit(updateItems)} 
    >
        <Grid container columnSpacing={1} mb={1} mt={1}>
            <Grid item xs={12} textAlign={"center"}>
                {'Add Levels'}
            </Grid>
            <Grid item xs={12} md={4}>
                {
                    (isFetchingRoles || isLoadingRoles) ?
                    <LinearProgress/> :
                    <Div sx={{  mt: 1  }}>
                        <Autocomplete
                            id="checkboxes-role_id"
                            options={roles}
                            defaultValue={item && item.role}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Role"
                                    size="small"
                                    fullWidth
                                    error={!!errors.role_id}
                                    helperText={errors.role_id?.message}
                                />
                            )}
                            onChange={(e, newValue) => {
                                setValue('role_id', newValue ? newValue.id : null, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                                setValue('role', newValue ? newValue : null);
                            }}
                        />
                    </Div>
                }
            </Grid>
            <Grid item xs={12} md={4}>
                <Div sx={{ mt: 1 }}>
                    <TextField
                        label="Label"
                        size="small"
                        fullWidth
                        error={errors && !!errors?.label}
                        helperText={errors && errors?.label?.message}
                        {...register('label')}
                    />
                </Div>
            </Grid>
            <Grid item xs={12} md={4}>
                <Div sx={{ mt: 1 }}>
                    <TextField
                        label="Remarks"
                        size="small"
                        multiline={true}
                        minRows={2}
                        fullWidth
                        {...register('remarks')}
                    />
                </Div>
            </Grid>
            <Grid item xs={6} md={2}>
                <Div sx={{ mt: 1}}>
                    <Checkbox
                        checked={can_finalize}
                        size='small'
                        onChange={(e) => {
                            const isChecked = e.target.checked;
                            setCan_finalize(isChecked);
                            setValue('can_finalize', isChecked ? 1 : 0, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        }}
                    />
                    Can Finalize
                </Div>
            </Grid>
            <Grid item xs={6} md={2}>
                <Div sx={{ mt: 1}}>
                    <Checkbox
                    checked={can_override}
                    size='small'
                    onChange={(e) => {
                        const isChecked = e.target.checked;
                        setCan_override(isChecked);
                        setValue('can_override', isChecked ? 1 : 0, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                    }}
                    />
                    Can Override
                </Div>
            </Grid>
            <Grid item xs={12} md={8} mt={0.3} textAlign={'end'}>
                <Div sx={{ mt: 1 }}>
                    <Button
                        variant='contained'
                        size='small'
                        type='submit'
                    >
                        {
                        item ? (
                            <><CheckOutlined fontSize='small' /> Done</>
                        ) : (
                            <><AddOutlined fontSize='small' /> Add</>
                        )
                        }
                    </Button>
                    {
                        item &&
                        <Tooltip title='Close Edit'>
                            <IconButton size='small'
                                onClick={() => {
                                setShowForm(false);
                                }}
                            >
                                <DisabledByDefault fontSize='small' color='success' />
                            </IconButton>
                        </Tooltip>
                    }
                </Div>
            </Grid>
        </Grid>
    </form>
  )
}

export default ApprovalChainsItemForm;

