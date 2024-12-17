import { Button, Divider, Stack, Toolbar, Typography } from '@mui/material';
import CategoryBoard from './category/CategoryBoardPage';
import useToken from '@hooks/useToken';
import { Link } from 'react-router-dom';

interface BoardListPageProps {}
const BoardListPage: React.FC<BoardListPageProps> = () => {
  const { user } = useToken();

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <Typography variant="h5">Notice</Typography>
        <Divider flexItem />
        <CategoryBoard category="notice" limit={5} />
      </Stack>
      <Stack gap={1}>
        <Typography variant="h5">Community</Typography>
        <Divider flexItem />
        <CategoryBoard category="community" limit={5} />
      </Stack>
      <Stack gap={1}>
        <Typography variant="h5">Event</Typography>
        <Divider flexItem />
        <CategoryBoard category="event" limit={5} />
      </Stack>
      <Stack gap={1}>
        <Typography variant="h5">FAQ</Typography>
        <Divider flexItem />
        <CategoryBoard category="faq" limit={5} />
      </Stack>
    </Stack>
  );
};

export default BoardListPage;
