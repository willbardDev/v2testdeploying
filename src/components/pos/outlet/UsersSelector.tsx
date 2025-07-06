import {
  Autocomplete,
  Checkbox,
  Chip,
  LinearProgress,
  TextField,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { user_ids } from "./OutletType";

type UsersSelectorProps = {
  multiple?: boolean;
  value: { id: number; name: string }[]; // must be controlled
  onChange: (value: { id: number; name: string }[]) => void;
  frontError?: FieldError | FieldError[];
  label?: string;
};

const UsersSelector: React.FC<UsersSelectorProps> = ({
  multiple = true,
  value,
  onChange,
  frontError,
  label = "Users",
}) => {
  const { data: users, isLoading } = useQuery<user_ids[], Error>({
    queryKey: ["userOptions"],
    queryFn: () => userService.getAllUsers(), // adjust this to your API call
  });

  if (isLoading) return <LinearProgress />;

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      options={users || []}
      value={value}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={(option) => option.name}
      disableCloseOnSelect={multiple}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!frontError}
          helperText={Array.isArray(frontError)
            ? frontError.map((e) => e?.message).join(", ")
            : frontError?.message}
          label={label}
          placeholder={label}
          fullWidth
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
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
    />
  );
};

export default UsersSelector;
