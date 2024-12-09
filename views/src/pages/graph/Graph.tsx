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
    navigate(`/graph/${to}s`);
  };

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack direction={{ xs: 'column', md: 'row' }} gap={5}>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleRedirect('poll')}
          sx={{
            flex: 1,
            height: 300,
            fontSize: 32,
            borderRadius: 5,
            background: (theme) => theme.palette.info.dark + '56',
            ['&:hover']: {
              background: (theme) => theme.palette.info.dark,
            },
          }}
        >
          설문지 그래프
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleRedirect('vote')}
          sx={{
            flex: 1,
            height: 300,
            fontSize: 32,
            borderRadius: 5,
            background: (theme) => theme.palette.info.dark + '56',
            ['&:hover']: {
              background: (theme) => theme.palette.info.dark,
            },
          }}
        >
          투표지 그래프
        </Button>
      </Stack>
    </Container>
  );
};

export default Graph;
