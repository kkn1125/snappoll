import { Box } from '@mui/material';

interface CellProps {
  active?: boolean;
}
const Cell: React.FC<CellProps> = ({ active = false }) => {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 1,
        backgroundColor: (theme) => (active ? theme.palette.info.main : '#eee'),
        border: '1px solid #eee',
        height: '1em',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default Cell;
