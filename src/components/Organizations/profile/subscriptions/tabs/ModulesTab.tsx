import { sanitizedNumber } from '@/app/helpers/input-sanitization-helpers';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { Div } from '@jumbo/shared';
import { Checkbox, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import { useSubscriptionFormContext } from '../SubscriptionFormContext';
import { SubscriptionModule } from '../SubscriptionTypes';

function ModulesTab() {
  const {
    totalModulesMonthly,
    userIsProsAfrican,
    modulesSelected,
    setModulesSelected,
    moduleValues,
    setModuleValues,
  } = useSubscriptionFormContext();

  const handleModuleChange = (moduleId: number, newRate: string | number) => {
    setModulesSelected((existingModules) =>
      existingModules.map((module) =>
        module.id === moduleId
          ? { ...module, monthly_rate: sanitizedNumber(newRate) || 0 }
          : module
      )
    );

    setModuleValues((prevValues: Module) => {
      const updatedValues = [...prevValues];
      const moduleIndex = updatedValues.findIndex(
        (module) => Number(module.id) === moduleId
      );

      if (moduleIndex !== -1) {
        updatedValues[moduleIndex] = {
          ...updatedValues[moduleIndex],
          monthly_rate: sanitizedNumber(newRate) || 0,
        };
      }

      return updatedValues;
    });
  };

  const handleCheckboxChange = (module: SubscriptionModule) => {
    setModulesSelected((existingModules) => {
      const isModuleSelected = existingModules.some(
        (presentModule: SubscriptionModule) => presentModule.id === module.id
      );

      if (isModuleSelected) {
        return existingModules.filter(
          (presentModule: SubscriptionModule) => presentModule.id !== module.id
        );
      } else {
        const updatedModule = {
          ...module,
          monthly_rate: sanitizedNumber(module.monthly_rate) || 0,
        };
        return [...existingModules, updatedModule];
      }
    });
  };

  return (
    <Grid container spacing={1}>
      {moduleValues?.map((module) => {
        const isSelected = modulesSelected.some(
          (presentModule) => presentModule.id === module.id
        );

        return (
          <Grid
            container
            key={module.id}
            alignItems="center"
            sx={{
              paddingBottom: 0.5,
              borderBottom: 1,
              borderColor: 'divider',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              width: '100%'
            }}
          >
            <Grid size={{xs: 2, md: 1, lg: 1}}>
              <Checkbox
                checked={isSelected}
                onChange={() => handleCheckboxChange(module)}
              />
            </Grid>
            <Grid size={{xs: 6, md: 8, lg: 8}}>
              <Typography>{module.name}</Typography>
            </Grid>
            {userIsProsAfrican ? (
              <Grid size={{xs: 4, md: 3, lg: 3}}>
                <Div sx={{ mt: 2 }}>
                  <TextField
                    label="Monthly Rate"
                    id={`monthlyRate_${module.id}`}
                    size="small"
                    fullWidth
                    value={module.monthly_rate}
                    onChange={(e) => handleModuleChange(Number(module.id), e.target.value)}
                    InputProps={{
                      inputComponent: CommaSeparatedField,
                    }}
                  />
                </Div>
              </Grid>
            ) : (
              <Grid size={{xs: 4, md: 3, lg: 3}}>
                <Typography align="right">
                  {module.monthly_rate.toLocaleString()}
                </Typography>
              </Grid>
            )}
          </Grid>
        );
      })}
      <Grid size={{xs: 12}} mb={2}>
        <Grid container spacing={1}>
          <Grid size={{xs: 8, md: 9}}>
            <Typography variant="h5">Modules Monthly Cost:</Typography>
          </Grid>
          <Grid size={{xs: 4, md: 3}}>
            <Typography align="right" variant="h5">
              {totalModulesMonthly.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ModulesTab;