import { getBoardList } from '@/apis/board/getBoardList';
import { SnapBoard } from '@models/SnapBoard';
import {
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { getUsernameOr } from '@utils/getUsernameOr';
import { translate } from '@utils/translate';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
          <Typography
            fontSize={20}
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {translate(key)}{' '}
            <Chip
              size="small"
              color={boardObject?.[key].length ? 'info' : 'default'}
              label={boardObject?.[key].length || 0}
            />
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
                <ListItemButton
                  component={Link}
                  to={`/board/${category.category}/${category.id}`}
                >
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
