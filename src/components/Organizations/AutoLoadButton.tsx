'use client';

import { Star, StarBorder } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState, useContext } from 'react';
import { OrganizationListContext } from './OrganizationsList';
import axios from '@/lib/services/config';
import { Organization } from '@/types/auth-types';
import { useDictionary } from '@/app/[lang]/contexts/DictionaryContext';

interface AutoLoadButtonProps {
  organization: Organization;
}

const AutoLoadButton: React.FC<AutoLoadButtonProps> = ({ organization }) => {
  const dictionary = useDictionary();
  const autoLoad = organization.autoload;
  const { refetchOrganizations } = useContext(OrganizationListContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const toggleAutoLoad = async (data: { autoload: boolean }) => {
    setLoading(true);
    try {
      await axios.get('/sanctum/csrf-cookie');
      const res = await axios.put(`/organizations/${organization.id}/toggle_autoload`, data);
      
      setOpen(false);
      if (res.status === 200) {
        refetchOrganizations();
        enqueueSnackbar(dictionary.organizations.list.autoLoad.messages.success, { variant: 'success' });
      } else {
        enqueueSnackbar(res.data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(dictionary.organizations.list.autoLoad.messages.error, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const dialogTitle = dictionary.organizations.list.autoLoad.dialog.title[autoLoad ? 'deactivate' : 'activate']
    .replace('{organizationName}', organization.name);

  const dialogDescription = dictionary.organizations.list.autoLoad.dialog.description[autoLoad ? 'deactivate' : 'activate']
    .replace('{organizationName}', organization.name);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogDescription}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {dictionary.organizations.list.autoLoad.dialog.buttons.cancel}
          </Button>
          <LoadingButton 
            loading={loading} 
            onClick={() => toggleAutoLoad({ autoload: !autoLoad })} 
            autoFocus
          >
            {dictionary.organizations.list.autoLoad.dialog.buttons.confirm}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <IconButton onClick={() => setOpen(true)}>
        <Tooltip 
          title={dictionary.organizations.list.autoLoad.button.tooltip[autoLoad ? 'deactivate' : 'activate']} 
          disableInteractive
        >
          {autoLoad ? (
            <Star fontSize="small" color="warning" />
          ) : (
            <StarBorder fontSize="small" />
          )}
        </Tooltip>
      </IconButton>
    </>
  );
};

export default AutoLoadButton;