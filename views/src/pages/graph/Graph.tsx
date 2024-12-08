import { getMyPolls } from '@/apis/poll/getMyPolls';
import { getMyVotes } from '@/apis/vote/getMyVotes';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import {
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
  Toolbar,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GraphProps {}
const Graph: React.FC<GraphProps> = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<'poll' | 'vote'>('poll');

  const myPolls = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['my-polls', page],
    queryFn: getMyPolls,
    enabled: false,
  });

  const myVotes = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['my-votes', page],
    queryFn: getMyVotes,
    enabled: false,
  });

  useEffect(() => {
    handleChangeCategory(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleChangeCategory = useCallback(
    (type: 'poll' | 'vote' = 'poll') => {
      if (type === 'poll') {
        myPolls.refetch();
        queryClient.resetQueries({ queryKey: ['my-votes'] });
      } else {
        myVotes.refetch();
        queryClient.resetQueries({ queryKey: ['my-polls'] });
      }
    },
    [myPolls, myVotes, queryClient],
  );

  const handleRedirect = (to: string) => {
    navigate(`/graph/${category}s/${to}`);
  };

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack>
        {/* section 01 */}
        <Stack direction="row" justifyContent="space-between">
          <ButtonGroup>
            <Button
              variant={category === 'poll' ? 'contained' : 'outlined'}
              onClick={() => setCategory('poll')}
            >
              Poll
            </Button>
            <Button
              variant={category === 'vote' ? 'contained' : 'outlined'}
              onClick={() => setCategory('vote')}
            >
              Vote
            </Button>
          </ButtonGroup>
          {/* <ButtonGroup>
            <Button>Poll</Button>
            <Button>Vote</Button>
          </ButtonGroup> */}
        </Stack>
        <Stack>
          <List>
            {myPolls.data?.polls.map((poll) => (
              <ListItem key={poll.id}>
                <ListItemButton onClick={() => handleRedirect(poll.id)}>
                  {poll.title}
                </ListItemButton>
              </ListItem>
            ))}
            {myVotes.data?.votes.map((vote) => (
              <ListItem key={vote.id}>
                <ListItemButton onClick={() => handleRedirect(vote.id)}>
                  {vote.title}
                </ListItemButton>
              </ListItem>
            ))}
            {myPolls.data?.count === 0 && myVotes.data?.count === 0 && (
              <ListItem>
                <ListItemText>데이터가 없습니다.</ListItemText>
              </ListItem>
            )}
          </List>
        </Stack>
        <Stack alignItems="center">
          <Pagination
            page={page}
            count={myPolls.data?.count || myVotes.data?.count || 0}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Graph;
