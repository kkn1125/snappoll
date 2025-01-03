import { SnapPollOption } from '@models/SnapPollOption';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Button,
  ButtonGroup,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { ChangeEvent } from 'react';
import CustomInput from './CustomInput';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface InputItemProps {
  index: number;
  content: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: () => void;
  errors: ErrorMessage<SnapPollOption>;
  handleOrder: (dir: boolean) => void;
}
const InputItem: React.FC<InputItemProps> = ({
  index,
  content,
  onChange,
  handleRemove,
  errors,
  handleOrder,
}) => {
  return (
    <ListItem sx={{ gap: 1 }}>
      <ListItemText
        primary={
          <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>{index}</Avatar>
        }
        sx={{ flex: '0 0 auto' }}
      />
      <ListItemText
        primary={
          <CustomInput
            autoFocus
            fullWidth
            placeholder="내용"
            size="small"
            name="content"
            variant="filled"
            value={content}
            onChange={onChange}
            type="text"
            sx={{ ['.MuiInputBase-input']: { pt: 1 } }}
            errors={errors}
          />
        }
        sx={{ flex: 1 }}
      />
      <Stack direction="row" gap={2} alignItems="center">
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={handleRemove}
        >
          <DeleteIcon />
        </IconButton>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleOrder(true)}
          sx={{ minWidth: 'auto', px: 1 }}
        >
          <ArrowDropUpIcon fontSize="small" />
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleOrder(false)}
          sx={{ minWidth: 'auto', px: 1 }}
        >
          <ArrowDropDownIcon fontSize="small" />
        </Button>
      </Stack>
    </ListItem>
  );
};

export default InputItem;
