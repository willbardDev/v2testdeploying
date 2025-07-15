import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface RequisitionsTypeSelectorProps {
  onChange: (value: string) => void;
  value?: string;
}

function RequisitionsTypeSelector({ onChange, value = 'all' }: RequisitionsTypeSelectorProps) {
  const [type, setType] = React.useState(value);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setType(newValue);
    onChange(newValue);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="process-types-filter-label">Type</InputLabel>
        <Select
          labelId="process-types-filter-label"
          id="process-types-filter-select"
          label="Type"
          value={type}
          onChange={handleChange}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="purchase">PURCHASE</MenuItem>
          <MenuItem value="payment">PAYMENT</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default RequisitionsTypeSelector;
