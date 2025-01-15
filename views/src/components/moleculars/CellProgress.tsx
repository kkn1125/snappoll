import Cell from '@components/atoms/Cell';
import { Stack, Typography } from '@mui/material';

interface CellProgressProps {
  title: string;
  count: number;
  max: number;
}
const CellProgress: React.FC<CellProgressProps> = ({ title, count, max }) => {
  return (
    <Stack flex={1} sx={{ boxSizing: 'border-box' }}>
      <Typography fontSize={18} fontWeight={700}>
        {title}
      </Typography>
      <Stack direction="row" gap={3} alignItems="center">
        <Stack direction="row" gap={0.2} alignItems="center" flex={1}>
          {Array.from(Array(max), (_, index) => (
            <Cell key={index} active={count > index} />
          ))}
        </Stack>
        <Typography>
          {count}/{max}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CellProgress;
