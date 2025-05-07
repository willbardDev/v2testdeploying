'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Grid, TextField, Typography, Alert, Tooltip } from '@mui/material';
import { Div } from '@jumbo/shared';
import { sanitizedNumber } from '@/app/helpers/input-sanitization-helpers';
import CommaSeparatedField from '@/shared/Inputs/CommaSeparatedField';
import { useSubscriptionFormContext } from '../SubscriptionFormContext';
import { AdditionalFeature } from '../SubscriptionTypes';

function AdditionalFeatures() {
  const {
    subscription,
    userIsProsAfrican,
    modulesSelected,
    totalAdditionalFeaturesMonthlyCost,
    additionalFeaturesSelected,
    setAdditionalFeaturesSelected,
    additionalFeatureValues,
    setAdditionalFeatureValues
  } = useSubscriptionFormContext();

  const quantityRefs = useRef<Record<string | number, HTMLInputElement | null>>({});
  const rateRefs = useRef<Record<string | number, HTMLInputElement | null>>({})

  // Collect all unique additional features from modulesSelected
  const additionalFeaturesSet = new Set();
  const [additionalFeatures, setAdditionalFeatures] = useState<AdditionalFeature[]>([]);

  useEffect(() => {
    // This effect will only run when modulesSelected changes
    const featuresToAdd: AdditionalFeature[] = [];
  
    modulesSelected.forEach(module => {
      module.additional_features?.forEach((feature: AdditionalFeature) => {
        if (!additionalFeaturesSet.has(feature.id)) {
          additionalFeaturesSet.add(feature.id);
          featuresToAdd.push(feature);
        }
      });
    });
  
    // Update the state only once after the loop finishes
    if (featuresToAdd.length > 0) {
      setAdditionalFeatures((prevFeatures) => [...prevFeatures, ...featuresToAdd]);
    }
  }, [modulesSelected]);

  useEffect(() => {
    additionalFeaturesSelected.forEach(feature => {
      setAdditionalFeatureValues((prevValues: AdditionalFeature) => ({
        ...prevValues,
          [feature.id]: {
          quantity: sanitizedNumber(feature.quantity),
          rate: sanitizedNumber(feature.rate),
        }
    }))});

    additionalFeaturesSelected.forEach(feature => {
      if (!additionalFeaturesSet.has(feature.id)) {
        additionalFeaturesSet.add(feature.id);
        setAdditionalFeatures(prevFeature => [...prevFeature, feature])
      }
    });
  }, [subscription]);

  const handleFeatureChange = (
    featureId: number,
    quantity: number,
    rate: number
  ) => {
    // setAdditionalFeaturesSelected((existingFeatures: AdditionalFeature[]) => 
    //   existingFeatures.map((feature: AdditionalFeature) =>
    //     feature.id === featureId 
    //       ? { 
    //           ...feature, 
    //           quantity: sanitizedNumber(quantity) || 0, 
    //           rate: sanitizedNumber(rate) || 0 
    //         } 
    //       : feature
    //   )
    // );

    setAdditionalFeatureValues((prevValues: AdditionalFeature) => ({
      ...prevValues,
      [featureId]: {
        quantity: sanitizedNumber(quantity) || 0,
        rate: sanitizedNumber(rate) || 0,
      }
    }));
  };

  return (
    <Grid container spacing={1} paddingTop={0.5}>
      {additionalFeatures.length === 0 ? (
        <Grid size={12}>
          <Alert variant='outlined' severity='info'>Please select at least one module to get additional features.</Alert>
        </Grid>
      ) : (
        additionalFeatures.map((additionaFeature, index) => {
          const isFeatureSelected = additionalFeaturesSelected.some((presentFeature) => presentFeature.id === additionaFeature.id);
          const currentValues = additionalFeatureValues[additionaFeature.id] || { quantity: additionaFeature.quantity, rate: additionaFeature.rate };

          return (
            <Grid
              container
              spacing={1}
              key={index}
              alignItems="center"
              sx={{
                paddingBottom: 0.5,
                borderBottom: 1,
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Grid size={{xs: 2, md: 1}}>
                <Checkbox
                  checked={isFeatureSelected}
                  onChange={() => {
                    // setAdditionalFeaturesSelected((existingFeatures) => {
                    //   if (isFeatureSelected) {
                    //     return existingFeatures.filter(
                    //       (presentFeature: AdditionalFeature) => presentFeature.id !== additionaFeature.id
                    //     );
                    //   } else {
                    //     const updatedFeature: AdditionalFeature = {
                    //       ...additionaFeature,
                    //       quantity: currentValues.quantity,
                    //       rate: currentValues.rate,
                    //     };
                    //     return [...existingFeatures, updatedFeature];
                    //   }
                    // });
                  }}
                />
              </Grid>
              <Grid size={{xs: 6, md: 3}}>
                <Typography>{additionaFeature.name}</Typography>
              </Grid>
              <Grid size={{xs: 4, lg: 2}}>
                <Div sx={{ mt: 2 }}>
                  <TextField
                    label='Quantity'
                    id={`quantity${additionaFeature.id}`}
                    size='small'
                    fullWidth
                    value={currentValues.quantity}
                    inputRef={(el) => (quantityRefs.current[additionaFeature.id] = el)}
                    onChange={(e) => handleFeatureChange(additionaFeature.id, Number(e.target.value), currentValues.rate)}
                    InputProps={{
                      inputComponent: CommaSeparatedField,
                      endAdornment: <span>{additionaFeature?.unit?.symbol}</span>
                    }}
                  />
                </Div>
              </Grid>
              <Grid size={{xs: 6, md: 4, lg: 3}}>
                {userIsProsAfrican ? (
                  <Div sx={{ mt: 2 }}>
                    <TextField
                      label='Monthly Rate'
                      id={`rate_${additionaFeature.id}`}
                      size='small'
                      fullWidth
                      value={currentValues.rate}
                      inputRef={(el) => (rateRefs.current[additionaFeature.id] = el)}
                      onChange={(e) => handleFeatureChange(additionaFeature.id, currentValues.quantity, Number(e.target.value))}
                      InputProps={{
                        inputComponent: CommaSeparatedField,
                      }}
                    />
                  </Div>
                ) : (
                  <Tooltip title={`Monthly Rate`}>
                    <Typography align='right'>{(currentValues.rate || 0).toLocaleString()}</Typography>
                  </Tooltip>
                )}
              </Grid>
              <Grid size={{xs: 6, md: 12, lg: 3}}>
                <Tooltip title={`Amount`}>
                  <Typography align='right'>{((currentValues.quantity || 0) * (currentValues.rate || 0)).toLocaleString()}</Typography>
                </Tooltip>
              </Grid>
            </Grid>
          );
        })
      )}
      {additionalFeatures.length > 0 && (
        <Grid size={{xs: 12, md: 2}}>
          <Grid container spacing={1} paddingTop={1}>
            <Grid size={9}>
              <Typography variant='h5'>Additional Features Monthly Cost:</Typography>
            </Grid>
            <Grid size={3}>
              <Typography align='right' variant='h5'>{totalAdditionalFeaturesMonthlyCost.toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default AdditionalFeatures;
