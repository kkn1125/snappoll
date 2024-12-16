import { getBoardCategoryOne } from '@/apis/board/getBoardCategoryOne';
import { SnapBoard } from '@models/SnapBoard';
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

interface DetailBoardPageProps {}
const DetailBoardPage: React.FC<DetailBoardPageProps> = () => {
  const { category, id } = useParams();
  const { data } = useQuery<SnapResponseType<SnapBoard>>({
    queryKey: ['board'],
    queryFn: () => getBoardCategoryOne(category, id),
  });
  const board = data?.data;

  return (
    <Container maxWidth="md">
      <Stack gap={2}>
        <Typography variant="h4">{board?.title}</Typography>
        <Typography align="right" color="textDisabled">
          작성자: {board?.author?.username}
        </Typography>
        <Divider flexItem />
        <Box>
          <Typography
            fontWeight={500}
            dangerouslySetInnerHTML={{ __html: board?.content || '' }}
          ></Typography>
        </Box>
        <Divider flexItem />
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => history.go(-1)}
          >
            이전으로
          </Button>
          <Button
            component={Link}
            variant="outlined"
            color="inherit"
            to={`/board/${category}`}
          >
            목록으로
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailBoardPage;
