import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useDebouncedCallback } from 'beautiful-react-hooks';
import React from 'react'

function PurchasesOrderStatusSelector({onChange,value}) {
  const [status, setStatus] = React.useState(value);

  const handleChange = useDebouncedCallback((event) => {
    setStatus(event.target.value);
  }); 

  React.useEffect(() => {
    onChange(status);
  }, [status]);

  React.useEffect(() => {
      return () => handleChange.cancel();
  });

  return (
    <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth size='small' label="Status">
          <InputLabel id="purchases-order-by-status">Status</InputLabel>
            <Select
                labelId="purchases-order-status-filter-label"
                id="purchases-order-status-filter-select"
                value={value}
                label={'Status'}
                onChange={handleChange}
            >
                <MenuItem value='All'>All</MenuItem>
                <MenuItem value='closed'>Closed</MenuItem>
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Partially Received'>Partially Received</MenuItem>
                <MenuItem value='Fully Received'>Fully Received</MenuItem>
            </Select>
        </FormControl>
    </Box>
  )
}

export default PurchasesOrderStatusSelector