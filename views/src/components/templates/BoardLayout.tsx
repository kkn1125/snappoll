import HistoryPrevBtn from '@components/atoms/HistoryPrevBtn';
import { Container, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

interface BoardLayoutProps {}
const BoardLayout: React.FC<BoardLayoutProps> = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Container>
      <Stack height="inherit" pt={5}>
        <Stack direction="row" justifyContent="flex-start" mb={2}>
          <HistoryPrevBtn />
        </Stack>
        <Outlet />
      </Stack>
    </Container>
  );
};

export default BoardLayout;
