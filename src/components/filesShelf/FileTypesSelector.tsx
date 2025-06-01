import React from 'react';
import { Box, Autocomplete, TextField } from '@mui/material';
import { useDebouncedCallback } from 'beautiful-react-hooks';

const options = [
    { label: "Documents", value: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"] },
    { label: "Images", value: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"] },
    { label: "Video", value: ["mp4", "mov", "avi", "mkv", "wmv"] },
    { label: "Audio", value: ["mp3"] },
];

function FileTypesSelector({ onChange, value }) {
  const [fileTypes, setFileTypes] = React.useState(
    options.filter(option => value.some(val => option.value.includes(val)))
  );

  const handleChange = useDebouncedCallback((event, newValue) => {
    const values = newValue.flatMap(option => option.value);
    setFileTypes(newValue);
    onChange(values);
  }, []);

  React.useEffect(() => {
    setFileTypes(
      options.filter(option => value.some(val => option.value.includes(val)))
    );
  }, [value]);

  React.useEffect(() => {
    return () => handleChange.cancel();
  }, [handleChange]);

  return (
    <Box sx={{ minWidth: 120 }}>
      <Autocomplete
        multiple
        options={options}
        size='small'
        fullWidth
        getOptionLabel={(option) => option.label}
        value={fileTypes}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="File Types"
          />
        )}
      />
    </Box>
  );
}

export default FileTypesSelector;
