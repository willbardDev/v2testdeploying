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

const OutletSelector = ({
  onChange,
  multiple = false,
  label = "Outlet",
  defaultValue = null,
  frontError = null
}: OutletSelectorProps) => {
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

  const allOutlet: any = useMemo(() => ({
    id: "all",
    name: "All Outlets",
    address: "",
    status: "active",
    cost_center: null,
    counters: [],
    stores: []
  }), []);

  const outlets: Outlet[] = useMemo(() => [allOutlet, ...rawOutlets], [rawOutlets, allOutlet]);

  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | Outlet[] | null>(
    defaultValue !== null
      ? defaultValue
      : multiple
      ? []
      : allOutlet
  );

  useEffect(() => {
    if (defaultValue !== null) {
      setSelectedOutlet(defaultValue);
      onChange(defaultValue);
    } else if (rawOutlets.length === 1) {
      // Automatically select the only outlet
      setSelectedOutlet(multiple ? [rawOutlets[0]] : rawOutlets[0]);
      onChange(multiple ? [rawOutlets[0]] : rawOutlets[0]);
    } else {
      const fallback = multiple ? [allOutlet] : allOutlet;
      setSelectedOutlet(fallback);
      onChange(fallback);
    }
  }, [defaultValue, multiple, rawOutlets, allOutlet]);

  if (isPending) {
    return <LinearProgress />;
  }

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
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
        tagValue.map((option, index) => {
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
          props: React.HTMLAttributes<HTMLLIElement>,
          option: Outlet,
          { selected }
        ) => (
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
      onChange={(e, newValue) => {
        setSelectedOutlet(newValue);
        onChange(newValue);
      }}
    />
  );
};

export default OutletSelector;
