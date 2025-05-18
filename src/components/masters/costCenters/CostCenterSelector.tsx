'use client'

import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Autocomplete, Box, Checkbox, Chip, LinearProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import costCenterservices from './cost-center-services';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { useQuery } from '@tanstack/react-query';

interface CostCenter {
  id: number;
  name: string;
  type: string;
  [key: string]: any;
}

interface CostCenterSelectorProps {
  frontError?: { message?: string } | null;
  removedCostCenters?: number[];
  allowAllCostCenters?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  allowSameType?: boolean;
  label?: string;
  multiple?: boolean;
  withNotSpecified?: boolean;
  defaultValue?: CostCenter | CostCenter[] | null;
  onChange: (value: CostCenter | CostCenter[] | null) => void;
}

function CostCenterSelector(props: CostCenterSelectorProps) {
  const { authOrganization } = useJumboAuth();
  const { 
    frontError = null, 
    removedCostCenters = [], 
    allowAllCostCenters = false, 
    disabled = false, 
    readOnly = false, 
    allowSameType = false, 
    label = 'Cost Center', 
    multiple = true, 
    withNotSpecified = false,
    onChange
  } = props;

  const [selectedItems, setSelectedItems] = useState<CostCenter | CostCenter[] | null>(
    props.defaultValue ? props.defaultValue : (multiple ? [] : null)
  );

  const { data: fetchedCostCenters, isLoading } = useQuery<CostCenter[]>({
    queryKey: ['allCostCenters'],
    queryFn: costCenterservices.getCostCenters,
    enabled: !!allowAllCostCenters
  });

  const authOrganizationCostCenters = authOrganization?.costCenters
    ? withNotSpecified
      ? authOrganization.costCenters
      : multiple
      ? authOrganization.costCenters
      : [
          { id: -1, name: 'Not Specified', type: 'Unassigned' },
          ...authOrganization.costCenters,
        ]
    : [];

  const allCostCenters = fetchedCostCenters
    ? withNotSpecified
      ? fetchedCostCenters
      : multiple
      ? fetchedCostCenters
      : [
          { id: -1, name: 'Not Specified', type: 'Unassigned' },
          ...fetchedCostCenters,
        ]
    : [];

  // Exclude cost centers with ids present in removedCostCenters
  const filteredCostCenters = (costCenters: CostCenter[]) =>
    costCenters.filter(
      (center) => !removedCostCenters.some((removed) => removed === center.id)
    );

  const finalCostCenters = allowAllCostCenters
    ? filteredCostCenters(allCostCenters)
    : filteredCostCenters(authOrganizationCostCenters);

  const handleOnChange = (
    event: React.SyntheticEvent, 
    newValue: CostCenter | CostCenter[] | null
  ) => {
    if (!allowSameType && multiple && Array.isArray(newValue)) {
      const uniqueTypes = Array.from(new Set(newValue.map(item => item.type)));
      if (uniqueTypes.length !== newValue.length) {
        // Remove duplicate items with the same type
        newValue = newValue.filter(
          (item, index, arr) => arr.findIndex(i => i.type === item.type) === index
        );
      }
    }

    setSelectedItems(newValue);
    onChange(newValue);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ minWidth: 150 }}>
      <Autocomplete
        multiple={multiple}
        options={finalCostCenters}
        disabled={disabled}
        readOnly={readOnly}
        getOptionLabel={(option: CostCenter) => option.name}
        isOptionEqualToValue={(option: CostCenter, value: CostCenter) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!frontError}
            helperText={frontError?.message}
            fullWidth
            label={label}
            size='small'
            placeholder={label}
          />
        )}
        value={selectedItems}
        onChange={handleOnChange}
        renderTags={(tagValue: CostCenter[], getTagProps) => {
          return tagValue.map((option: CostCenter, index: number) => {
            const { key, ...restProps } = getTagProps({ index });
            return <Chip {...restProps} key={`${option.id}-${key}`} label={option.name} />;
          });
        }}
        {...(multiple && { 
          renderOption: (
            props: React.HTMLAttributes<HTMLLIElement>, 
            option: CostCenter, 
            { selected }
          ) => (
            <li {...props} key={option.id}>
              <Checkbox
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
               {option.name}
            </li>
          )
        })}
      />
    </Box>
  );
}

export default CostCenterSelector;