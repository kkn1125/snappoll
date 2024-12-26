import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

interface BoardLayoutProps {}
const BoardLayout: React.FC<BoardLayoutProps> = () => {
  return (
    <Stack height="inherit" pt={5}>
      <Outlet />
    </Stack>
  );
};

export default BoardLayout;
