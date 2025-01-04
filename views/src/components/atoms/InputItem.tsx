import { SnapPollOption } from '@models/SnapPollOption';
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
import OrderControlButton from './OrderControlButton';

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
      <OrderControlButton
        handleRemove={handleRemove}
        handleOrder={handleOrder}
      />
    </ListItem>
  );
};

export default InputItem;
