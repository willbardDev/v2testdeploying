import React, { useState } from 'react';
import { TextField, Switch, Grid, Typography, Tooltip, IconButton, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import { LoadingButton } from '@mui/lab';
import moduleSettingsServices from './moduleSettingsServices';
import { useForm } from 'react-hook-form';
import { InfoOutlined } from '@mui/icons-material';

function ModuleSettings({ module }) {
  const { enqueueSnackbar } = useSnackbar();
  const [updatedSettings, setUpdatedSettings] = useState([]);

  const { mutate: updateSettings, isLoading} = useMutation(moduleSettingsServices.updateSettings, {
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      window.location.reload();
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
      });
    },
  });

  const { handleSubmit } = useForm();

  const saveMutation = (data) => {
    updateSettings({ settings: updatedSettings });
  };

  const handleSettingsChange = (id, value) => {
    setUpdatedSettings((prevSettings) => {
      const existingSettingIndex = prevSettings.findIndex(item => item.module_setting_id === id);
      if (existingSettingIndex > -1) {
        // Update the existing Setting Value
        const updatedValues = [...prevSettings];
        updatedValues[existingSettingIndex] = { module_setting_id: id, value: value };
        return updatedValues;
      } else {
        // Add a new Setting in updatedSettings array
        return [...prevSettings, { module_setting_id: id, value: value }];
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(saveMutation)}>
      <Grid container spacing={1} padding={2}>
        {module[0].settings.map((setting) => (
          <Grid item xs={12} key={setting.id}>
            <Grid container alignItems="center" spacing={1} paddingBottom={1}>
              <Grid item xs={10} md={5}>
                <Typography variant="subtitle1">{setting.name}</Typography>
              </Grid>
              <Grid item xs={2} md={0.5}>
                <Tooltip title={setting.description}>
                  <IconButton size="small">
                    <InfoOutlined/>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12} md={6.5}>
                {setting.data_type === 'boolean' ? (
                  <Switch
                    size='small'
                    defaultChecked={setting.value}
                    onChange={(e) => handleSettingsChange(setting.id, e.target.checked)}
                  />
                ) : setting.data_type === 'text' ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size='small'
                    variant="outlined"
                    defaultValue={setting.value}
                    onChange={(e) => handleSettingsChange(setting.id, e.target.value)}
                  />
                ) : setting.data_type === 'integer' ? (
                  <TextField
                    fullWidth
                    type="number"
                    size='small'
                    variant="outlined"
                    defaultValue={setting.value}
                    onChange={(e) => handleSettingsChange(setting.id, e.target.value)}
                  />
                ) : setting.data_type === 'string' ? (
                  <TextField
                    fullWidth
                    size='small'
                    variant="outlined"
                    defaultValue={setting.value}
                    onChange={(e) => handleSettingsChange(setting.id, e.target.value)}
                  />
                ) : setting.data_type === 'double' ? (
                  <TextField
                    fullWidth
                    size='small'
                    variant="outlined"
                    defaultValue={setting.value}
                    onChange={(e) => handleSettingsChange(setting.id, e.target.value)}
                  />
                ) : null}
              </Grid>
            </Grid>
            <Divider/>
          </Grid>
        ))}
        <Grid item xs={12} textAlign={'right'} padding={1}>
          <LoadingButton 
            loading={isLoading} 
            type="submit" 
            size='small'
            variant="contained" 
            color="primary"
            disabled={updatedSettings.length === 0}
          >
            Save
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default ModuleSettings;
