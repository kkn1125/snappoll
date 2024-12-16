import { getBoardCategory } from '@/apis/board/getBoardCategory';
import BoardItem from '@components/atoms/BoardItem';
import { SnapBoard } from '@models/SnapBoard';
import { Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

interface CategoryBoardPageProps {
  category?: string;
  limit?: number;
}
const CategoryBoardPage: React.FC<CategoryBoardPageProps> = ({
  category,
  limit,
}) => {
  const params = useParams();
  const [searchParam] = useSearchParams({ page: '1' });
  const page = searchParam.get('page') || '1';
  const { data, isLoading } = useQuery<
    SnapResponseType<{ board: SnapBoard[] }>
  >({
    queryKey: ['CategoryBoardPage'],
    queryFn: () => getBoardCategory(page, category || params.category),
  });

  const board = data?.data?.board;

  if (isLoading) return <>loading...</>;

  if (!board) return <Typography>등록된 게시글이 없습니다.</Typography>;

  return (
    <Stack>
      {data?.data?.board?.map((board) => (
        <BoardItem key={board.id} board={board} />
      ))}
    </Stack>
  );
};

export default CategoryBoardPage;
