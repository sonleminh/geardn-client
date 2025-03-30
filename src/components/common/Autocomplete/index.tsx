import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';

interface Option {
  label: string;
  value: string;
}
// const CustomAutocomplete = ({
//   options,
//   label = 'Select an option',
//   placeholder,
//   onChange,
//   sx,
// }: {
//   options: Option[];
//   label?: string;
//   placeholder?: string;
//   onChange?: (value: Option | null) => void;
//   sx?: SxProps<Theme>;
// }) => {

type CustomAutocompleteProps = AutocompleteProps & { label: string };

const CustomAutocomplete = ({
  options,
  label = 'Select an option',
  placeholder,
  onChange,
  sx,
}: {
  options: Option[];
  label?: string;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Autocomplete
      sx={sx}
      options={options}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component='li' {...optionProps}>
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder ?? ''}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            },
          }}
        />
      )}
    />
  );
};

export default CustomAutocomplete;
