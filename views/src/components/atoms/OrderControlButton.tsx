import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack, IconButton, Button } from '@mui/material';
import { useEffect } from 'react';

interface OrderControlButtonProps {
  handleRemove: () => void;
  handleOrder: (isUp: boolean) => void;
}
const OrderControlButton: React.FC<OrderControlButtonProps> = ({
  handleRemove,
  handleOrder,
}) => {
  return (
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
        onClick={(e) => {
          const main = e.target as HTMLButtonElement;
          handleOrder(true);
          queueMicrotask(() => {
            setTimeout(() => {
              main?.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'start',
              });
            }, 0);
          });
        }}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <ArrowDropUpIcon fontSize="small" />
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={(e) => {
          const main = e.target as HTMLButtonElement;
          handleOrder(false);
          queueMicrotask(() => {
            setTimeout(() => {
              main?.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'start',
              });
            }, 0);
          });
        }}
        sx={{ minWidth: 'auto', px: 1 }}
      >
        <ArrowDropDownIcon fontSize="small" />
      </Button>
    </Stack>
  );
};

export default OrderControlButton;
