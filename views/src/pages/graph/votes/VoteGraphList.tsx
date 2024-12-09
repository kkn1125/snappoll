import { getMyVotes } from '@/apis/vote/getMyVotes';
import { SnapVote } from '@models/SnapVote';
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

interface VoteGraphListProps {}
const VoteGraphList: React.FC<VoteGraphListProps> = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const myVotes = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['my-votes', page],
    queryFn: getMyVotes,
  });
  const handleRedirect = (to: string) => {
    navigate(`/graph/votes/${to}`);
  };

  const totalPage = useMemo(() => {
    const count = myVotes.data?.count || 0;
    return Math.ceil(count / 10);
  }, [myVotes.data?.count]);

  return (
    <Container maxWidth="md">
      <Stack>
        <List>
          {myVotes.data?.votes.map((vote) => (
            <ListItem key={vote.id}>
              <ListItemButton onClick={() => handleRedirect(vote.id)}>
                {vote.title}
              </ListItemButton>
            </ListItem>
          ))}{' '}
          {myVotes.data?.count === 0 && (
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

export default VoteGraphList;
