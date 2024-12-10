import { getMyPolls } from '@/apis/poll/getMyPolls';
import SkeletonGraphList from '@components/moleculars/SkeletonGraphList';
import { SnapPoll } from '@models/SnapPoll';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface PollGraphListProps {}
const PollGraphList: React.FC<PollGraphListProps> = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const myPolls = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['my-polls', page],
    queryFn: getMyPolls,
  });
  const handleRedirect = (to: string) => {
    navigate(`/graph/polls/${to}`);
  };

  const totalPage = useMemo(() => {
    const count = myPolls.data?.count || 0;
    return Math.ceil(count / 10);
  }, [myPolls.data?.count]);

  if (myPolls.isLoading) return <SkeletonGraphList />;

  return (
    <Stack>
      <List>
        {myPolls.data?.polls.map((poll) => (
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
                secondary={`작성자: ${poll.user?.username} | 생성일: ${new Date(poll.createdAt).toLocaleDateString()}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {myPolls.data?.count === 0 && (
          <ListItem>
            <ListItemText>데이터가 없습니다.</ListItemText>
          </ListItem>
        )}
      </List>
      <Stack alignItems="center">
        <Pagination page={page} count={totalPage} />
      </Stack>
    </Stack>
  );
};

export default PollGraphList;
