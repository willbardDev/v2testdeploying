import { yupResolver } from '@hookform/resolvers/yup';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import Div from '@jumbo/shared/Div/Div';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Checkbox, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField} from '@mui/material';
import organizationServices from 'app/prosServices/prosERP/organizations/organizationServices';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as yup from "yup";
import approvalChainsServices from '../approvalChainsServices';
import { approvalChainsListItemContext } from '../ApprovalChainsListItem';

function ApprovalChainLevelDialog({approvalChainLevel, toggleOpen, approvalChain}) {
  const {enqueueSnackbar} =  useSnackbar();
  const queryClient = useQueryClient();
  const {authOrganization} = useJumboAuth();
  const [can_finalize, setCan_finalize] = useState(approvalChainLevel?.can_finalize === 1 ? true : false);
  const [can_override, setCan_override] = useState(approvalChainLevel?.can_override === 1 ? true : false);
  const { approvalChainLevels } = useContext(approvalChainsListItemContext);

  const validationSchema = yup.object({
    label: yup.string().required('Label is required').typeError('Label is required'),
    role_id: yup.string().required('Role is required').typeError('Role is required'),
  });

  const addNewChainLevel = useMutation(approvalChainsServices.addNewChainLevel,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['approvalChainLevels']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  })

  const editApprovalChainLevel = useMutation(approvalChainsServices.editApprovalChainLevel,{
    onSuccess: (data) => {
      toggleOpen(false);
      enqueueSnackbar(data.message,{variant : 'success'});
      queryClient.invalidateQueries(['approvalChainLevels']);
    },
    onError: (error) => {
      error?.response?.data?.message && enqueueSnackbar(error.response.data.message,{variant:'error'});
    }
  })

  const { setValue, register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: approvalChainLevel && approvalChainLevel.id,
      approval_chain_id: approvalChain && approvalChain.id,
      position_index: approvalChainLevel && approvalChainLevel.position_index,
      can_finalize: approvalChainLevel ? approvalChainLevel.can_finalize : 0,
      can_override: approvalChainLevel ? approvalChainLevel.can_override : 0,
      label: approvalChainLevel && approvalChainLevel.label,
      remarks: approvalChainLevel && approvalChainLevel.remarks,
      role_id: approvalChainLevel && approvalChainLevel.role_id,
      role: approvalChainLevel && approvalChainLevel.role,
    }
  });

  const { data: roles, isLoading: isLoadingRoles, isFetching: isFetchingRoles } = useQuery(`organizationRoles_${authOrganization.organization.id}`, async () => organizationServices.roles(authOrganization.organization?.id));

  const positionIndexOptions = [
    { label: 'At the beginning', position_index: null, id: null },
    ...approvalChainLevels.map((level) => ({
      label: `After ${level.role.name} ${level.label}`, 
      position_index: level.position_index, 
      id: level.id,
    })),
  ];  

  const saveMutation = React.useMemo(() => {
    return approvalChain ? addNewChainLevel.mutate : editApprovalChainLevel.mutate
  },[approvalChain, addNewChainLevel, editApprovalChainLevel]);

  const onSubmit = (formData) => {
    saveMutation(formData);
  };

  return (
    <>
      <DialogTitle>
        <Grid container columnSpacing={1} >
          <Grid item xs={12} textAlign={"center"}>
            {approvalChain ? 'Add New Chain Level' : 'Edit Level'}
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <form 
          autoComplete='off' 
          onSubmit={handleSubmit()} 
        >
          <Grid container columnSpacing={1} mb={1}>
            <Grid item xs={12} md={4}>
              {
                (isFetchingRoles || isLoadingRoles) ?
                <LinearProgress/> :
                  <Div sx={{  mt: 1  }}>
                    <Autocomplete
                      id="checkboxes-role_id"
                      options={roles}
                      defaultValue={approvalChainLevel && approvalChainLevel.role}
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
              <Div sx={{ mt: 1}}>
                <Autocomplete
                  options={approvalChainLevel ? positionIndexOptions.filter(index => index.position_index !== approvalChainLevel.position_index) : positionIndexOptions}
                  isOptionEqualToValue={(option,value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
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
            <Grid item xs={6} md={4}>
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
            <Grid item xs={6} md={4}>
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button size='small' onClick={() => toggleOpen(false)}>
          Cancel
        </Button>
        <LoadingButton
          loading={editApprovalChainLevel.isLoading || addNewChainLevel.isLoading}
          variant='contained' 
          onClick={handleSubmit(onSubmit)}
          size='small'
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  )
}

export default ApprovalChainLevelDialog;
