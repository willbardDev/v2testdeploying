import { useQuery } from "@tanstack/react-query";
import {
  Autocomplete,
  Checkbox,
  Chip,
  LinearProgress,
  TextField,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ProjectCategory } from "../projectCategories/ProjectCategoriesType";
import projectCategoryServices from "../projectCategories/project-category-services";

interface ProjectCategoriesSelectorProps {
  onChange: (value: ProjectCategory | ProjectCategory[] | null) => void;
  multiple?: boolean;
  label?: string;
  defaultValue?: number | null;
  frontError?: { message: string } | null;
}

const ProjectCategoriesSelector: React.FC<ProjectCategoriesSelectorProps> = ({
  onChange,
  multiple = false,
  label = "Project Category",
  defaultValue = null,
  frontError = null,
}) => {
  const { data, isLoading } = useQuery<ProjectCategory[], Error>({
    queryKey: ["projectCategories"],
    queryFn: () => projectCategoryServices.getAll(),
  });

  const [selectedCategories, setSelectedCategories] = useState<
    ProjectCategory | ProjectCategory[] | null
  >(() => {
    if (defaultValue !== null && Array.isArray(data)) {
      return data.find((cat) => cat.id === defaultValue) || null;
    }
    return multiple ? [] : null;
  });

  useEffect(() => {
    if (defaultValue !== null && Array.isArray(data)) {
      const found = data.find((cat) => cat.id === defaultValue) || null;
      setSelectedCategories(multiple ? (found ? [found] : []) : found);
    }
  }, [defaultValue, data, multiple]);

  if (isLoading) return <LinearProgress />;

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      options={data ?? []} // ✅ Fix: ensure it's always an array
      disableCloseOnSelect={multiple}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedCategories ?? (multiple ? [] : null)}
      onChange={(e, newValue) => {
        onChange(newValue);
        setSelectedCategories(newValue);
      }}
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
        tagValue.map((option, index) => {
          const { key, ...restProps } = getTagProps({ index });
          return (
            <Chip key={`${option.id}-${key}`} label={option.name} {...restProps} />
          );
        })
      }
      renderOption={(props, option, { selected }) => {
        const { key, ...restProps } = props;
        return (
          <li {...restProps} key={`${option.id}-${key}`}>
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
        );
      }}
    />
  );
};

export default ProjectCategoriesSelector;
