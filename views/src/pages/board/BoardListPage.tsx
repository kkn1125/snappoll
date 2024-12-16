import { Button, Stack, Typography } from '@mui/material';
import CategoryBoard from './category/CategoryBoardPage';
import useToken from '@hooks/useToken';

interface BoardListPageProps {}
const BoardListPage: React.FC<BoardListPageProps> = () => {
  const { user } = useToken();

  return (
    <Stack>
      {user && <Button>글 작성</Button>}
      <Typography variant="h4">공지사항</Typography>
      <CategoryBoard category="notice" limit={5} />
    </Stack>
  );
};

export default BoardListPage;
