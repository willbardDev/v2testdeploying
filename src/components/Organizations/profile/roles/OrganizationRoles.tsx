'use client'

import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useOrganizationProfile } from '../OrganizationProfileProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import organizationServices from '@/lib/services/organizationServices';
import axios from '@/lib/services/config';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { NewRoleForm } from './NewRoleForm';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
}

const OrganizationRoles = () => {
  const { checkOrganizationPermission } = useJumboAuth();
  const { showDialog, hideDialog } = useJumboDialog();
  const { organization } = useOrganizationProfile();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery<Permission[]>({
    queryKey: ['organizationPermissionsOptions', organization?.id],
    queryFn: async () => organizationServices.getPermissionOptions(organization?.id),
    enabled: !!organization?.id,
  });

  const { data: roles = [], isLoading: isLoadingRoles, isFetching: isFetchingRoles } = useQuery<Role[]>({
    queryKey: ['organizationRoles', organization?.id],
    queryFn: async () => organizationServices.getRoles(organization?.id),
    enabled: !!organization?.id,
  });

  const deleteRole = (role: Role) => {
    showDialog({
      variant: 'confirm',
      title: `Delete ${role.name} role?`,
      content: `All users with this role won't have it anymore`,
      onYes: async () => {
        hideDialog();
        try {
          const res = await axios.put(`organizations/${organization?.id}/delete-role`, { role_id: role.id });
          enqueueSnackbar(res.data.message, { variant: 'success' });
      
          await queryClient.invalidateQueries({ queryKey: ['organizationRoles', organization?.id] });
        } catch (err: any) {
          if (err?.response?.data?.message) {
            enqueueSnackbar(err.response.data.message, { variant: 'error' });
          }
        }
      }
    });
  };

  const RoleAccordion: React.FC<{ role: Role }> = ({ role }) => {
    const [checkedPermissions, setCheckedPermissions] = useState<number[]>(
      role.permissions
        .filter(rolePermission => 
          permissions?.some((permission: Permission) => permission.id === rolePermission.id)
        )
        .map(permission => permission.id)
    );

    const [isSavingRole, setIsSavingRole] = useState(false);
    const [roleIsNotTouched, setRoleIsNotTouched] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPermissions = permissions?.filter((permission: Permission) =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const allPermissionsChecked = filteredPermissions.length > 0 &&
      filteredPermissions.every((permission: Permission) => checkedPermissions.includes(permission.id));
    const somePermissionsChecked = filteredPermissions.some((permission: Permission) =>
      checkedPermissions.includes(permission.id)) && !allPermissionsChecked;

    const saveRole = async () => {
      setIsSavingRole(true);
      try {
        const response = await axios.put(`organizations/${organization?.id}/edit-role`, {
          role_id: role.id,
          permission_ids: checkedPermissions
        });
        enqueueSnackbar(response.data.message, { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['organizationRoles', organization?.id] });
        setRoleIsNotTouched(true);
      } catch (error: any) {
        if (error?.response?.data?.message) {
          enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
      } finally {
        setIsSavingRole(false);
      }
    };

    return (
      <Grid size={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <Typography variant='h4'>
              {role.name}
            </Typography>
            {role.description && (
              <Typography ml={1} variant='caption'>- {role.description}</Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Grid container columnSpacing={2}>
              {role.id > 1 && (
                <>
                  <Grid size={{xs: 12, md: 6, lg: 3}}>
                    <TextField
                      label="Search"
                      variant="outlined"
                      size='small'
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid size={{xs: 6, md: 3}}>
                    <FormControlLabel
                      label="Select All"
                      control={
                        <Checkbox
                          checked={allPermissionsChecked}
                          indeterminate={somePermissionsChecked}
                          onChange={(event) => {
                            setRoleIsNotTouched(false);
                            if (event.target.checked) {
                              setCheckedPermissions(prev => Array.from(new Set([...prev, ...filteredPermissions.map(p => p.id)])));
                            } else {
                              setCheckedPermissions(prev =>
                                prev.filter(id => !filteredPermissions.some(p => p.id === id))
                              );
                            }
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                </>
              )}
              {filteredPermissions.map((permission: Permission) => (
                <Grid size={{xs: 12, md: 6, lg: 4, xl: 3}} key={permission.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={permission.id}
                        disabled={role.id === 1 || (role.id > 1 && !checkOrganizationPermission(PERMISSIONS.ROLES_UPDATE))}
                        checked={checkedPermissions.includes(permission.id)}
                        onChange={(e) => {
                          setRoleIsNotTouched(false);
                          const permissionId = parseInt(e.target.value.toString());
                          setCheckedPermissions(prev =>
                            e.target.checked
                              ? [...prev, permissionId]
                              : prev.filter(id => id !== permissionId)
                          );
                        }}
                      />
                    }
                    label={permission.name}
                  />
                </Grid>
              ))}
              {role.id > 1 && (
                <Grid size={12}>
                  <Divider />
                  <Stack direction='row' spacing={1} mt={1} justifyContent='flex-end'>
                    {checkOrganizationPermission(PERMISSIONS.ROLES_ADD) && (
                      <Button
                        sx={{ marginLeft: 0.5 }}
                        onClick={() => deleteRole(role)}
                        size='small'
                        variant='contained'
                        color='error'
                      >
                        Delete
                      </Button>
                    )}
                    {checkOrganizationPermission(PERMISSIONS.ROLES_UPDATE) && (
                      <LoadingButton
                        disabled={roleIsNotTouched}
                        loading={isSavingRole}
                        onClick={saveRole}
                        size='small'
                        variant='contained'
                        color='primary'
                      >
                        Save
                      </LoadingButton>
                    )}
                  </Stack>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  };

  if (isLoadingRoles || isLoadingPermissions || isFetchingRoles) {
    return <LinearProgress />;
  }

  return (
    <Grid mt={1} container rowSpacing={1} columnSpacing={2}>
      {checkOrganizationPermission(PERMISSIONS.ROLES_ADD) && (
        <Grid size={12}>
          <NewRoleForm />
        </Grid>
      )}
      {roles?.map((role: Role) => (
        <RoleAccordion key={role.id} role={role} />
      ))}
    </Grid>
  );
};

export default OrganizationRoles;
