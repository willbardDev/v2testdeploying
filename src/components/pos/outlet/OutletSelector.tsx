import posServices from "../pos-services";
import { Autocomplete, Checkbox, Chip, LinearProgress, TextField } from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useJumboAuth } from "@/app/providers/JumboAuthProvider";
import { CostCenter } from "@/components/masters/costCenters/CostCenterType";

interface Counter {
  id: number;
  name: string;
  description: string | null;
  ledgers: Array<{
    id: number;
    name: string;
    alias: string | null;
    ledger_group_id: number;
  }>;
}

interface Store {
  id: number;
  name: string;
}

interface Outlet {
  id: number;
  name: string;
  address: string | null;
  status: string;
  cost_center: CostCenter;
  counters: Counter[];
  stores: Store[];
}

interface OutletSelectorProps {
  onChange: (newValue: Outlet | Outlet[] | null) => void;
  multiple?: boolean;
  label?: string;
  defaultValue?: Outlet | Outlet[] | null;
  frontError?: {
    message?: string;
  } | null;
}

const OutletSelector = (props: OutletSelectorProps) => {
  const {
    onChange,
    multiple = false,
    label = 'Outlet',
    defaultValue = null,
    frontError = null
  } = props;

  const { authUser } = useJumboAuth();
  
  const { data: outlets = [], isPending } = useQuery({
    queryKey: ['userSalesOutlets', authUser?.user?.id],
    queryFn: ({ queryKey }) => posServices.getUserOutlets({ userId: queryKey[1] }),
    select: (data) => data.map((outlet: any) => ({
      id: outlet.id,
      name: outlet.name,
      address: outlet.address,
      status: outlet.status,
      cost_center: outlet.cost_center,
      counters: outlet.counters,
      stores: outlet.stores
    })),
    enabled: !!authUser?.user?.id // Only fetch when userId is available
  });

  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | Outlet[] | null>(
    defaultValue !== null ? defaultValue : (multiple ? [] : null)
  );

  useEffect(() => {
    if (defaultValue !== null || (multiple && defaultValue === null)) {
      setSelectedOutlet(defaultValue !== null ? defaultValue : []);
    }
  }, [defaultValue, multiple]);

  if (isPending) {
    return <LinearProgress />;
  }

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      isOptionEqualToValue={(option: Outlet, value: Outlet) => option?.id === value?.id}
      options={outlets || []}
      disableCloseOnSelect={multiple}
      value={selectedOutlet}
      getOptionLabel={(option: Outlet) => option?.name || ''}
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
      renderTags={(tagValue: Outlet[], getTagProps) => {
        return tagValue?.map((option, index) => (
          <Chip 
            {...getTagProps({ index })}
            key={`${option.id}-${index}`}
            label={option.name}
          />
        ));
      }}
      {...(multiple && {
        renderOption: (props, option: Outlet, { selected }) => (
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
      onChange={(e, newValue: Outlet | Outlet[] | null) => {
        onChange(newValue);
        setSelectedOutlet(newValue);
      }}
    />
  );
};

export default OutletSelector;