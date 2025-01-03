import { Button, SxProps } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface HistoryPrevBtnProps {
  name?: string;
  sx?: SxProps;
}
const HistoryPrevBtn: React.FC<HistoryPrevBtnProps> = ({
  name = '이전으로',
  sx,
}) => {
  return (
    <Button
      startIcon={<ArrowBackIosIcon />}
      onClick={() => {
        history.back();
      }}
      sx={sx}
    >
      {name}
    </Button>
  );
};

export default HistoryPrevBtn;
