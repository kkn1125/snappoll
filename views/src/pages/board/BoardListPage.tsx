import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CategoryBoard from './category/CategoryBoardPage';
import { useQuery } from '@tanstack/react-query';
import { getBoardList } from '@/apis/board/getBoardList';
import { useLocation } from 'react-router-dom';
import { SnapBoard } from '@models/SnapBoard';
import { useCallback } from 'react';
import { translate } from '@utils/translate';
import { formattedDate } from '@utils/formattedDate';
import { getUsernameOr } from '@utils/getUsernameOr';

interface BoardListPageProps {}
const BoardListPage: React.FC<BoardListPageProps> = () => {
  const eachAmount = '5';
  const locate = useLocation();
  const { data } = useQuery<
    SnapResponseType<Record<SnapBoard['category'], SnapBoard[]>>
  >({
    queryKey: ['boardListOfCategories', locate.pathname],
    queryFn: () => getBoardList(eachAmount),
  });

  const boardObject = data?.data;
  const boardKeys = [
    ...Object.keys(boardObject || {}),
  ] as SnapBoard['category'][];

  const getColumns = useCallback((list?: SnapBoard[]) => {
    if (list?.[0]) {
      return Object.keys(list?.[0]);
    }
    return [] as string[];
  }, []);

  return (
    <Stack gap={2}>
      {boardKeys.map((key) => (
        <Stack key={key} component={Paper} p={3}>
          <Typography fontSize={20} fontWeight={700}>
            {translate(key)}
          </Typography>
          <List>
            {(!boardObject?.[key] || boardObject?.[key].length === 0) && (
              <ListItem>
                <ListItemButton>
                  <ListItemText
                    primary={`등록된 ${translate(key)} 글이 없습니다.`}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {boardObject?.[key]?.map((category) => (
              <ListItem key={category.id}>
                <ListItemButton>
                  <ListItemText
                    primary={category.title}
                    secondary={`작성자: ${getUsernameOr(category.author?.username)} | 생성일: ${formattedDate(category.createdAt)}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      ))}
    </Stack>
  );
};

export default BoardListPage;
