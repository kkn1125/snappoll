import { SxProps, TextField, TextFieldPropsSizeOverrides } from '@mui/material';
import { ChangeEvent, memo } from 'react';

interface CustomInputProps {
  name: string;
  label?: string;
  type?: string;
  size?: OverridableStringUnion<
    'small' | 'medium',
    TextFieldPropsSizeOverrides
  >;
  value: string;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<string, string>>;
  rows?: number;
  required?: boolean;
  multiline?: boolean;
  sx?: SxProps;
  endAdornment?: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
}
function CustomInput({
  name,
  label,
  size = 'medium',
  type = 'text',
  value,
  variant = 'outlined',
  fullWidth = false,
  placeholder,
  autoFocus = false,
  autoComplete,
  multiline = false,
  onChange,
  errors,
  rows,
  required = false,
  sx = {},
  endAdornment,
  defaultValue,
  disabled = false,
}: CustomInputProps) {
  return (
    <TextField
      autoFocus={autoFocus}
      variant={variant}
      placeholder={placeholder && placeholder + (required ? '*' : '')}
      label={label}
      name={name}
      size={size}
      type={type}
      value={value}
      rows={rows}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      multiline={multiline}
      onChange={onChange}
      required={required}
      error={!!errors?.[name]}
      helperText={errors?.[name]}
      defaultValue={defaultValue}
      sx={sx}
      disabled={disabled}
      slotProps={{
        input: {
          endAdornment,
        },
      }}
    />
  );
}

export default memo(CustomInput);
