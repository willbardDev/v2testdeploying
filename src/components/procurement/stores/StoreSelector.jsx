import React, { useState } from 'react'
import { useQuery } from 'react-query';
import storeServices from './store-services';
import { Autocomplete, Checkbox, Chip, LinearProgress, TextField } from '@mui/material';
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

function StoreSelector({onChange, frontError = null, multiple = false, label = 'Store', defaultValue = null, allowSubStores = false, excludeStores = null, includeStores = null, proposedOptions = null}) {
  //Fetch Stores
  const { data: stores, isLoading: isFetchingStores } = useQuery('storeOptions', storeServices.getStoreOptions);
  const [selectedStore, setSelectedStore] = useState(defaultValue ? defaultValue : (multiple ? [] : null));

  // Engine for stores when allowSubStores is true 
  const toOptions = (stores, depth = 0, parent_id = null) => {
    const { id, name, children = [] } = stores;
    const subStores = children.flatMap((child) =>
      toOptions(child, depth + 1, id)
    );
    const option = {
      id,
      name,
      depth,
      parent_id,
      matchTerms: [name].concat(subStores.map((obj) => obj.name))
    };
    return [option].concat(subStores);
  };
  
  let storeOptions;
  if (!!allowSubStores) {
    if (proposedOptions) {
      storeOptions = proposedOptions.flatMap(stores => toOptions(stores));
    } else if (stores) {
      storeOptions = stores.flatMap(stores => toOptions(stores));
    }
  } else {
    storeOptions = proposedOptions || stores;
  }

  let finalOptions = storeOptions; // Filter options if excludeStores or includeStores is provided
  if (excludeStores) {
    finalOptions = storeOptions?.filter(option => !excludeStores.every(store => store.id === option.id));
  } else if (includeStores) {
    finalOptions = storeOptions?.filter(option => includeStores.some(store => store.id === option.id));
  }

  if (isFetchingStores) {
    return <LinearProgress />;
  }

  return (
    <Autocomplete
      id="checkboxes-stores"
      multiple={multiple}
      options={finalOptions}
      disableCloseOnSelect={multiple}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      value={selectedStore}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          fullWidth
          error={!!frontError}
          helperText={frontError?.message}
          value={
            multiple
              ? selectedStore?.map((item) => item.name).join(", ")
              : selectedStore
          }
        />
      )}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => {
          const { key, ...restProps } = getTagProps({ index });
          return <Chip {...restProps} key={option.id + "-" + key} label={option.name} />;
        });
      }}
      renderOption={(props, option, { selected, inputValue }) => {
        const { key, ...restProps } = props;
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        return (
          <li {...restProps} key={option.id + "-" + key}>
            {multiple && (
              <Checkbox
                size="small"
                sx={allowSubStores ? { ml: 2 * option.depth } : {}}
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                checked={selected}
              />
            )}
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
      onChange={(e, newValue) => {
        onChange(newValue);
        setSelectedStore(newValue);
      }}
    />
  );
}

export default StoreSelector;
