import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  LinearProgress,
  TextField,
} from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import projectCategoryServices from "../projectCategories/project-category-services";
import { ProjectCategory } from "../projectCategories/ProjectCategoriesType";

interface ProjectCategoriesSelectorProps {
  onChange: (value: ProjectCategory | ProjectCategory[] | null) => void;
  multiple?: boolean;
  label?: string;
  defaultValue?: ProjectCategory | ProjectCategory[] | null;
  frontError?: { message: string } | null;
}

const ProjectCategoriesSelector: React.FC<ProjectCategoriesSelectorProps> = ({
  onChange,
  multiple = false,
  label = "Project Category",
  defaultValue = null,
  frontError = null,
}) => {
  const { data: categories, isLoading } = useQuery<ProjectCategory[], Error>({
    queryKey: ["projectCategories"],
    queryFn: () => projectCategoryServices.getAll(),
  });

  const [selectedCategories, setSelectedCategories] = useState<
    ProjectCategory | ProjectCategory[] | null
  >(defaultValue ?? (multiple ? [] : null));

  useEffect(() => {
    if (defaultValue) {
      setSelectedCategories(defaultValue);
    }
  }, [defaultValue]);

  if (isLoading) return <LinearProgress />;

  return (
    <Autocomplete
      multiple={multiple}
      options={categories ?? []}
      disableCloseOnSelect={multiple}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => {
  if (typeof option === 'string') return option;
  if (!option || typeof option !== 'object') return '';
  return option.name ?? '';
}}
      value={selectedCategories ?? (multiple ? [] : null)}
      onChange={(e, newValue) => {
        onChange(newValue);
        setSelectedCategories(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          fullWidth
          error={!!frontError}
          helperText={frontError?.message}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
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
      renderOption={(props, option, { selected }) => {
        const { key, ...restProps } = props;
        return (
          <li {...restProps} key={`${option.id}-${key}`}>
            {multiple && (
              <Checkbox
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                checked={selected}
                style={{ marginRight: 8 }}
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
