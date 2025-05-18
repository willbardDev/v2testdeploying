import React, { useEffect, useState } from 'react';
import { Autocomplete, Checkbox, Chip, LinearProgress, TextField } from '@mui/material';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBox from '@mui/icons-material/CheckBox';
import axios from '@/lib/services/config';

interface User {
  id: number;
  name: string;
  [key: string]: any;
}

interface UsersSelectorProps {
  onChange: (value: User | User[] | null) => void;
  multiple?: boolean;
  label?: string;
  defaultValue?: User | User[] | null;
  frontError?: {
    message?: string;
  } | null;
}

const UsersSelector: React.FC<UsersSelectorProps> = ({
  onChange,
  multiple = false,
  label = 'Users',
  defaultValue = null,
  frontError = null,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{message: string} | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User | User[] | null>(() => {
    if (!defaultValue) return multiple ? [] : null;
    
    return multiple 
      ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue])
      : (Array.isArray(defaultValue) ? defaultValue[0] : defaultValue);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<User[]>('users');
        setUsers(response.data);
      } catch (err) {
        setError({
          message: (err as Error).message || 'Failed to load users'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!defaultValue || users.length === 0) return;

    const updateSelectedUsers = () => {
      if (multiple) {
        const defaultIds = Array.isArray(defaultValue) 
          ? defaultValue.map(user => user.id)
          : [defaultValue.id];
        setSelectedUsers(users.filter(user => defaultIds.includes(user.id)));
      } else {
        const targetId = Array.isArray(defaultValue) ? defaultValue[0]?.id : defaultValue?.id;
        setSelectedUsers(users.find(user => user.id === targetId) || null);
      }
    };

    updateSelectedUsers();
  }, [defaultValue, users, multiple]);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <Autocomplete
      multiple={multiple}
      size="small"
      isOptionEqualToValue={(option, value) => option.id === value.id}
      options={users}
      disableCloseOnSelect={multiple}
      value={selectedUsers}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!frontError || !!error}
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
      renderOption={(props, option, { selected }) => {
        // Extract the key from props and apply it to the li element
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Checkbox
              icon={<CheckBoxOutlineBlank fontSize="small" />}
              checkedIcon={<CheckBox fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        );
      }}
      onChange={(_, newValue) => {
        onChange(newValue);
        setSelectedUsers(newValue);
      }}
    />
  );
};

export default UsersSelector;