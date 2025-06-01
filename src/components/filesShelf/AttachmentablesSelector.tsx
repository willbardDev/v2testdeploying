import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDebouncedCallback } from 'beautiful-react-hooks';

  const options = [
    { label: "Payment", value: "payment" },
    { label: "Receipt", value: "receipt" },
    { label: "Journal Voucher", value: "journal_voucher" },
    { label: "Fund Transfer", value: "fund_transfer" },
    { label: "Purchase Order", value: "purchase_order" },
    { label: "Grn", value: "grn" },
    { label: "Sale", value: "sale" },
    { label: "Project", value: "project" },
    { label: "Sub Contracts", value: "project_subcontract" },
    { label: "Delivery Note", value: "delivery_note" },
    { label: "Requisitions", value: "requisition" }
  ].sort((a, b) => a.label.localeCompare(b.label));

function AttachmentablesSelector({ onChange, value }) {
  const [attachmentable, setAttachmentable] = React.useState(
    options.filter(option => value.includes(option.value))
  );

  const handleChange = useDebouncedCallback((event, newValue) => {
    const values = newValue.map(option => option.value);
    setAttachmentable(newValue);
    onChange(values);
  }, []);

  React.useEffect(() => {
    setAttachmentable(
      options.filter(option => value.includes(option.value))
    );
  }, [value]);

  React.useEffect(() => {
    return () => handleChange.cancel();
  }, [handleChange]);

  return (
    <Autocomplete
      multiple
      options={options}
      fullWidth={true}
      size='small'
      getOptionLabel={(option) => option.label}
      value={attachmentable}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          label="Related To"
        />
      )}
    />
  );
}

export default AttachmentablesSelector;
