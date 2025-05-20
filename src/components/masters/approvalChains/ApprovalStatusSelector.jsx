import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useDebouncedCallback } from 'beautiful-react-hooks';
import React from 'react'

function ApprovalStatusSelector({onChange,value}) {
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
        <InputLabel id="status">Status</InputLabel>
          <Select
              labelId="status-filter-label"
              id="status-filter-select"
              value={value}
              label={'Status'}
              onChange={handleChange}
          >
              <MenuItem value='all'>All</MenuItem>
              <MenuItem value='Active'>Active</MenuItem>
              <MenuItem value='Inactive'>Inactive</MenuItem>
          </Select>
      </FormControl>
    </Box>
  )
}

export default ApprovalStatusSelector