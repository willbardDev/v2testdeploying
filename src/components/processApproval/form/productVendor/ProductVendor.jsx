import React, { useEffect, useState } from 'react';
import { Grid, IconButton, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AddOutlined, CheckOutlined, DisabledByDefault } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import StakeholderSelector from 'app/prosServices/prosERP/masters/stakeholders/StakeholderSelector';
import Div from '@jumbo/shared/Div';
import StakeholderQuickAdd from 'app/prosServices/prosERP/masters/stakeholders/StakeholderQuickAdd';
import { useStakeholderSelect } from 'app/prosServices/prosERP/masters/stakeholders/StakeholderSelectProvider';

function ProductVendor({ isFromApproval, vendorIndex, index = -1, setShowForm = null, vendor, setRequisition_product_items, vendors=[], setVendors }) {
  const [isAdding, setIsAdding] = useState(false);
  const {stakeholders} = useStakeholderSelect();
  const [stakeholderQuickAddDisplay, setStakeholderQuickAddDisplay] = useState(false);
  const [addedStakeholder, setAddedStakeholder] = useState(null);

  const validationSchema = yup.object({
    stakeholder_id: yup
      .number()
      .required("Stakeholder is required")
      .typeError('Stakeholder is required')
      .test(
        'unique-stakeholder',
        'Vendor already exists',
        (value) => {
          // Exclude the current vendor being edited
          const isEditing = index > -1 && vendors[index]?.stakeholder?.id === value;
          const isDuplicate = vendors.some((vendor) => vendor.stakeholder?.id === value);
          return isEditing || !isDuplicate;
        }
      ),
  });  

  const {setValue, handleSubmit, reset, formState: {errors}} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      stakeholder: vendor && stakeholders.find(stakeholder => stakeholder.id === vendor.stakeholder_id),
      stakeholder_id: vendor ? vendor.stakeholder_id : null,
      remarks: vendor && vendor.remarks,
    }
  });

  const updateItems = async (vendor) => {
    setIsAdding(true);
    if (index > -1) {
      // Replace the existing item with the edited item
      let updatedProductVendor = [...vendors];
      updatedProductVendor[index] = vendor;
      await setVendors(updatedProductVendor);
    } else {
      // Add the new item to the productVendor array
      await setVendors((productVendor) => [...productVendor, vendor]);
    }

    reset();
    setIsAdding(false);
    setAddedStakeholder(null);
    setShowForm && setShowForm(false);
  };

  useEffect(() => {
    if (!vendor) {
        setRequisition_product_items((prevItems) => {
            return prevItems.map((product_item, index) => {
                if (index === vendorIndex) {
                return { ...product_item, vendors: [...vendors] };
                }
                return product_item;
            });
        });   
    }
  }, [vendors]);

    // setvalues from coming addedStakeholder
    useEffect(() => {
        if(addedStakeholder?.id){
            setValue('stakeholder_id', addedStakeholder.id);
            setValue(`stakeholder`, addedStakeholder)
            setStakeholderQuickAddDisplay(false)
        }
    }, [addedStakeholder])

  if (isAdding) {
    return <LinearProgress />;
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit(updateItems)}>
      <Grid container spacing={0.5} paddingBottom={0.5} paddingTop={0.5}>
        {!stakeholderQuickAddDisplay &&
            <>
                {!isFromApproval &&
                    <Grid item xs={12}>
                        <Typography variant='h5' textAlign={'center'}>Add Vendor</Typography>
                    </Grid>
                }
                <Grid item xs={12} md={5}>
                    <Div sx={{ mt: 0.3}}>
                        <StakeholderSelector
                            label='Vendor'
                            defaultValue={vendor && vendor.stakeholder_id}
                            frontError={errors.stakeholder_id}
                            addedStakeholder={addedStakeholder}
                            onChange={(newValue) => {
                                setValue(`stakeholder`, newValue)
                                setValue(`stakeholder_id`, newValue ? newValue.id : null,{
                                    shouldDirty: true,
                                    shouldValidate: true
                                });
                            }}
                            startAdornment= {
                                <Tooltip title={'Add Client'}>
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
                <Grid item xs={12} md={6}>
                    <Div sx={{ mt: 0.3}}>
                        <TextField
                            size="small"
                            fullWidth
                            defaultValue={vendor && vendor.remarks}
                            label="Remarks"
                            multiline={true}
                            rows={2}
                            onChange={(e) => {
                                setValue(`remarks`,e.target.value ? e.target.value : '',{
                                    shouldValidate: true,
                                    shouldDirty: true
                                });
                            }}
                        />
                    </Div>
                </Grid>
                <Grid item xs={12} md={1} textAlign={'end'}>
                    <LoadingButton
                        loading={false}
                        variant='contained'
                        type='submit'
                        size='small'
                        sx={{marginBottom: 0.5}}
                    >
                        {
                            vendor ? (
                                <><CheckOutlined fontSize='small' /> Done</>
                            ) : (
                                <><AddOutlined fontSize='small' /> Add</>
                            )
                        }
                    </LoadingButton>
                    {
                        vendor && 
                        <Tooltip title='Close Edit'>
                            <IconButton size='small' 
                                onClick={() => {
                                    setShowForm(false);
                                }}
                            >
                                <DisabledByDefault fontSize='small' color='success'/>
                            </IconButton>
                        </Tooltip>
                    }
                </Grid>
            </>
        }

        {stakeholderQuickAddDisplay && <StakeholderQuickAdd setStakeholderQuickAddDisplay={setStakeholderQuickAddDisplay} create_payable={true} setAddedStakeholder={setAddedStakeholder}/>} 
      </Grid>
    </form>
  );
}

export default ProductVendor;
