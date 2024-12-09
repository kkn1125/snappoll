import { getMyPolls } from '@/apis/poll/getMyPolls';
import { SnapPoll } from '@models/SnapPoll';
import {
  Container,
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

  return (
    <Container maxWidth="md">
      <Stack>
        <List>
          {myPolls.data?.polls.map((poll) => (
            <ListItem key={poll.id}>
              <ListItemButton onClick={() => handleRedirect(poll.id)}>
                {poll.title}
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
    </Container>
  );
};

export default PollGraphList;
