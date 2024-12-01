import { SxProps, TextField } from '@mui/material';
import { ChangeEvent, memo } from 'react';

interface CustomInputProps {
  name: string;
  label?: string;
  type?: string;
  size?: 'small' | 'medium' | 'large';
  value: string;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  rows?: number;
  required?: boolean;
  multiline?: boolean;
  sx?: SxProps;
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
}: CustomInputProps) {
  return (
    <TextField
      autoFocus={autoFocus}
      variant={variant}
      placeholder={placeholder && placeholder + (required ? '*' : '')}
      label={label}
      name={name}
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
      sx={sx}
    />
  );
}

export default memo(CustomInput);
