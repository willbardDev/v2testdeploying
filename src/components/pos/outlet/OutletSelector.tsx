import posServices from "../pos-services";
import {
  Autocomplete,
  Checkbox,
  Chip,
  LinearProgress,
  TextField
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useJumboAuth } from "@/app/providers/JumboAuthProvider";
import { Outlet } from "./OutletType";

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
    label = "Outlet",
    defaultValue = null,
    frontError = null
  } = props;

  const { authUser } = useJumboAuth();

  const { data: rawOutlets = [], isPending } = useQuery({
    queryKey: ["userSalesOutlets", authUser?.user?.id],
    queryFn: ({ queryKey }) =>
      posServices.getUserOutlets({ userId: queryKey[1] }),
    select: (data) =>
      data.map((outlet: any) => ({
        id: outlet.id,
        name: outlet.name,
        address: outlet.address,
        status: outlet.status,
        cost_center: outlet.cost_center,
        counters: outlet.counters,
        stores: outlet.stores
      })),
    enabled: !!authUser?.user?.id
  });

  // Append "All Outlets"
  const outlets: Outlet[] = useMemo(() => {
    const allOutlet: any = {
      id: "all",
      name: "All Outlets",
      address: "",
      status: "active",
      cost_center: null,
      counters: [],
      stores: []
    };
    return [allOutlet, ...rawOutlets];
  }, [rawOutlets]);

  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | Outlet[] | null>(
    defaultValue !== null ? defaultValue : multiple ? [] : null
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
      isOptionEqualToValue={(option: Outlet, value: Outlet) =>
        option?.id === value?.id
      }
      options={outlets}
      disableCloseOnSelect={multiple}
      value={selectedOutlet}
      getOptionLabel={(option: Outlet) => option?.name || ""}
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
      renderTags={(tagValue: Outlet[], getTagProps) =>
        tagValue.map((option: Outlet, index: number) => {
          const { key, ...restProps } = getTagProps({ index });
          return (
            <Chip
              {...restProps}
              key={`${option.id}-${key}`}
              label={option.name}
            />
          );
        })
      }
      {...(multiple && {
        renderOption: (
          props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
          option: Outlet,
          { selected }
        ) => {
          const { key, ...otherProps } = props;
          return (
            <li key={option.id} {...otherProps}>
              <Checkbox
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          );
        }
      })}
      onChange={(e, newValue: Outlet | Outlet[] | null) => {
        setSelectedOutlet(newValue);
        onChange(newValue);
      }}
    />
  );
};

export default OutletSelector;
