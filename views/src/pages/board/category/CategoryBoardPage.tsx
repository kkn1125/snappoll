import { getBoardCategory } from '@/apis/board/getBoardCategory';
import BoardItem from '@components/atoms/BoardItem';
import { SnapBoard } from '@models/SnapBoard';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import NotfoundPage from '@pages/NotfoundPage';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

interface CategoryBoardPageProps {
  category?: string;
  limit?: number;
}
const CategoryBoardPage: React.FC<CategoryBoardPageProps> = ({
  category,
  limit,
}) => {
  const locate = useLocation();
  const params = useParams();
  const [searchParam] = useSearchParams({ page: '1' });
  const page = searchParam.get('page') || '1';
  const currentCategory = category || params.category;
  const { data, isLoading } = useQuery<
    SnapResponseType<{ board: SnapBoard[] }>
  >({
    queryKey: [
      'CategoryBoardPage',
      category,
      params.category,
      page,
      locate.pathname,
    ],
    queryFn: () => getBoardCategory(page, currentCategory),
  });
  const board = data?.data?.board;
  const boardName = useMemo(() => {
    switch (currentCategory) {
      case 'notice':
        return '공지사항이';
      case 'event':
        return '이벤트가';
      case 'faq':
        return '문의사항이';
      case 'community':
      default:
        return '게시글이';
    }
  }, [currentCategory]);

  /* 허용되지 않는 경로 NotFound 처리 */
  if (!['notice', 'faq', 'community', 'event'].includes(currentCategory || ''))
    return <NotfoundPage />;

  if (isLoading) return <>loading...</>;

  return (
    <Stack>
      <Stack direction="row">
        {currentCategory === 'community' && (
          <Button
            component={Link}
            variant="outlined"
            color="inherit"
            size="large"
            to={`/board/${currentCategory}/write`}
          >
            글 쓰기
          </Button>
        )}
      </Stack>
      <List>
        {(limit ? data?.data?.board?.slice(0, limit) : data?.data?.board)?.map(
          (board) => <BoardItem key={board.id} board={board} />,
        )}
        {(!board || board.length === 0) && (
          <ListItem>
            <ListItemButton>
              <ListItemText primary={`등록된 ${boardName} 없습니다.`} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Stack>
  );
};

export default CategoryBoardPage;
