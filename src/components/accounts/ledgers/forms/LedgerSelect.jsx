import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';
import React from 'react'
import { useLedgerSelect } from './LedgerSelectProvider';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

function LedgerSelect(props) {
    const {onChange,frontError = null,label = 'Select Ledger',defaultValue = null,allowedGroups = [],notAllowedGroups = [], value = null} = props;
    const {ledgerOptions,extractLedgers} = useLedgerSelect();

    const multiple = props?.multiple;
    const [options, setOptions] = React.useState([]);
    const [selectedValue, setSelectedValue] = React.useState(!!defaultValue ? defaultValue : (multiple ? [] : value));

    React.useEffect(() => {
      setOptions([]); //Reset options first before populating them
      extractLedgers(ledgerOptions,notAllowedGroups,allowedGroups,setOptions);
    }, [ledgerOptions])
    
  return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            value={selectedValue}
            multiple={multiple}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField 
                    {...params}
                    size="small"
                    fullWidth
                    label={label}
                    error={!!frontError}
                    helperText={frontError?.message}
                />
            )}
            renderOption={props?.renderOption && props.renderOption }
            onChange={(event, newValue) => {
                onChange(newValue);
                setSelectedValue(newValue);
            }}

            renderTags={(tagValue, getTagProps)=> {
                return tagValue.map((option, index)=>{
                     const {key, ...restProps} = getTagProps({index});
                      return <Chip {...restProps} key={option.id+"-"+key} label={option.name} />
                 })
              }}

             // Conditionally render the renderOption property
            {...(multiple && { renderOption: (props, option, { selected }) => {
                const { key, ...restProps} = props
              return  (
                <li {...restProps} key={option.id+"-"+key}>
                    <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                        checkedIcon={<CheckBox fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.name}
                </li>
                )
            }})}
        />
  )
}

export default LedgerSelect