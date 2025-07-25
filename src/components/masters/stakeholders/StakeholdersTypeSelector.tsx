'use client'

import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';

type StakeholderType = 'all' | 'customers' | 'suppliers' | string;

interface StakeholdersTypeSelectorProps {
  onChange: (type: StakeholderType) => void;
  value: StakeholderType;
}

const StakeholdersTypeSelector: React.FC<StakeholdersTypeSelectorProps> = ({ onChange, value }) => {
  const [type, setType] = useState<StakeholderType>(value);

  const handleChange = (event: SelectChangeEvent<StakeholderType>) => {
    const newValue = event.target.value as StakeholderType;
    setType(newValue);
    onChange(newValue);
  };

  React.useEffect(() => {
    onChange(type);
  }, [type, onChange]);

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl component="div" fullWidth size='small'>
        <InputLabel id="stakeholders-types-filter-label">Type</InputLabel>
        <Select
          labelId="stakeholders-types-filter-label"
          id="stakeholders-types-filter-select"
          value={value}
          label={'Type'}
          fullWidth
          onChange={handleChange}
        >
          <MenuItem value='all'>All</MenuItem>
          <MenuItem value='customers'>Customers</MenuItem>
          <MenuItem value='suppliers'>Suppliers</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default StakeholdersTypeSelector;