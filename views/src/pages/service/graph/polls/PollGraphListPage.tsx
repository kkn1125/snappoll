import { getMyPolls } from '@apis/poll/getMyPolls';
import CommonPagination from '@components/atoms/CommonPagination';
import SkeletonGraphList from '@components/moleculars/SkeletonGraphList';
import { SnapPoll } from '@models/SnapPoll';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { getUsernameOr } from '@utils/getUsernameOr';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PollGraphListPageProps {}
const PollGraphListPage: React.FC<PollGraphListPageProps> = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery<
    SnapResponseType<{ polls: SnapPoll[]; count: number }>
  >({
    queryKey: ['my-polls', page],
    queryFn: getMyPolls,
  });
  const responseData = data?.data;
  const handleRedirect = (to: string) => {
    navigate(`/service/graph/poll/${to}`);
  };

  const total = useMemo(() => {
    const count = responseData?.count || 0;
    return Math.ceil(count / 10);
  }, [responseData?.count]);

  if (isLoading) return <SkeletonGraphList />;

  return (
    <Stack>
      <List>
        {responseData?.polls.map((poll) => (
          <ListItem key={poll.id}>
            <ListItemButton
              onClick={() => handleRedirect(poll.id)}
              sx={{ display: 'flex', gap: 2.5 }}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
                width={50}
                minWidth={50}
                height={50}
                minHeight={50}
                sx={{
                  borderRadius: '100%',
                  boxShadow: '3px 3px 5px 0 #00000056',
                }}
              >
                <BarChartIcon color="success" fontSize="large" />
              </Stack>
              <ListItemText
                primary={poll.title}
                secondary={`작성자: ${getUsernameOr(poll.user?.username)} | 생성일: ${formattedDate(poll.createdAt)}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {responseData?.count === 0 && (
          <ListItem>
            <ListItemText>데이터가 없습니다.</ListItemText>
          </ListItem>
        )}
      </List>
      <CommonPagination total={total} />
    </Stack>
  );
};

export default PollGraphListPage;
