import React from 'react';
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { SxProps, Theme } from "@mui/material/styles";
import { Div } from '@jumbo/shared';
import { useDebouncedCallback } from 'use-debounce';

interface JumboSearchProps {
  onChange: (value: string) => void;
  value?: string;
  sx?: SxProps<Theme>;
}

const JumboSearch: React.FC<JumboSearchProps> = React.memo(({ onChange, value = '', sx }) => {
  const [searchKeywords, setSearchKeywords] = React.useState<string>(value);

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeywords(event.target.value);
    },
    1000
  );

  React.useEffect(() => {
    onChange(searchKeywords);
  }, [searchKeywords, onChange]);

  React.useEffect(() => {
    return () => {
      handleChange.cancel();
    };
  }, [handleChange]);

  return (
    <Div sx={{ position: 'relative', width: '100%', ...sx }}>
      <Div
        sx={{
          padding: (theme: Theme) => theme.spacing(0, 2),
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }}
      >
        <SearchIcon />
      </Div>
      <InputBase
        sx={{
          color: 'inherit',
          display: 'flex',
          borderRadius: 24,
          backgroundColor: (theme: Theme) =>
            theme.jumboComponents?.JumboSearch?.background ?? 'rgba(255, 255, 255, 0.15)',

          '& .MuiInputBase-input': {
            padding: (theme: Theme) => theme.spacing(1, 1, 1, 0),
            paddingLeft: (theme: Theme) => `calc(1em + ${theme.spacing(4)})`,
            transition: (theme: Theme) => theme.transitions.create('width'),
            width: '100%',
            height: 24
          },
        }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        autoFocus
        onChange={handleChange}
        defaultValue={value}
      />
    </Div>
  );
});

export default JumboSearch;
