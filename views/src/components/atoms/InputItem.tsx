import { SnapPollOption } from '@models/SnapPollOption';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, IconButton, ListItem, ListItemText } from '@mui/material';
import { ChangeEvent } from 'react';
import CustomInput from './CustomInput';

interface InputItemProps {
  index: number;
  content: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemove: () => void;
  errors: ErrorMessage<SnapPollOption>;
}
const InputItem: React.FC<InputItemProps> = ({
  index,
  content,
  onChange,
  handleRemove,
  errors,
}) => {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={handleRemove}
        >
          <DeleteIcon />
        </IconButton>
      }
      sx={{ gap: 1 }}
    >
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
    </ListItem>
  );
};

export default InputItem;
