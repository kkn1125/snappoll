import { TextField } from '@mui/material';
import { ChangeEvent, memo } from 'react';

interface CustomInputProps {
  name: string;
  label: string;
  type: string;
  value: string;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  required?: boolean;
}
function CustomInput({
  name,
  label,
  type,
  value,
  autoFocus = false,
  autoComplete,
  onChange,
  errors,
  required = false,
}: CustomInputProps) {
  return (
    <TextField
      autoFocus={autoFocus}
      variant="filled"
      label={label}
      name={name}
      type={type}
      value={value}
      autoComplete={autoComplete}
      onChange={onChange}
      required={required}
      error={!!errors?.[name]}
      helperText={errors?.[name]}
    />
  );
}

export default memo(CustomInput);
