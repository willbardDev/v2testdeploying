import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Checkbox, Chip, LinearProgress, TextField } from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useEffect, useState } from "react";
import outletService from "./OutletServices";
import { Outlet } from "./OutletType";

interface OutletSelectorProps {
  onChange: (value: Outlet | Outlet[] | null) => void;
  multiple?: boolean;
  label?: string;
  defaultValue?: number | null;
  frontError?: { message: string } | null;
}

const OutletSelector: React.FC<OutletSelectorProps> = (props) => {
  const {
    onChange,
    multiple = false,
    label = "Outlet",
    defaultValue = null,
    frontError = null,
  } = props;

  const { data: outlets, isLoading } = useQuery<Outlet[], Error>({
    queryKey: ["outletOptions"],
    queryFn: () => outletService.getAllOutlets(),
  });

  const [selectedOutlets, setSelectedOutlets] = useState<Outlet | Outlet[] | null>(() => {
    if (defaultValue !== null && outlets) {
      return outlets.find((outlet: Outlet) => outlet.id === defaultValue) || null;
    }
    return multiple ? [] : null;
  });

  useEffect(() => {
    if (defaultValue !== null && outlets) {
      setSelectedOutlets(
        outlets.find((outlet: Outlet) => outlet.id === defaultValue) || null
      );
    }
  }, [defaultValue, outlets]);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={outlets || []}
      disableCloseOnSelect={multiple}
      value={selectedOutlets}
      getOptionLabel={(option) => option.name}

      renderInput={(params) => (
        <TextField
          {...params}
          error={!!frontError}
          helperText={frontError?.message}
          fullWidth
          label={label}
          size="small"
          placeholder={label}
        />
      )}

        renderTags={(tagValue, getTagProps) =>
      tagValue.map((option, index) => (
        <Chip
          {...getTagProps({ index })}
          key={option.id}
          label={option.name}
        />
      ))
    }

    renderOption={(props, option, { selected }) => (
      <li {...props} key={option.id}>
        {multiple && (
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBox fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
        )}
        {option.name}
      </li>
    )}

      onChange={(e, newValue) => {
        onChange(newValue);
        setSelectedOutlets(newValue);
      }}
    />
  );
};

export default OutletSelector;
