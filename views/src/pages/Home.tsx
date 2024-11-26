import { getPolls } from '@/apis/getPolls';
import { removePoll } from '@/apis/removePoll';
import { tokenAtom } from '@/recoils/token.atom';
import { BRAND_NAME } from '@common/variables';
import useLoading from '@hooks/useLoading';
import {
  Button,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MouseEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const Home = () => {
  const { openLoading, updateLoading } = useLoading();
  const { userId } = useRecoilValue(tokenAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const query = useQuery<APIPoll[]>({
    queryKey: ['polls'],
    queryFn: getPollList,
  });

  const mutation = useMutation({
    mutationKey: ['polls-remove'],
    mutationFn: (pollId: string) => removePoll(pollId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });
  async function getPollList() {
    const polls = await getPolls();
    updateLoading();
    return polls;
  }

  function handleRemovePoll(pollId: string) {
    return (e: MouseEvent) => {
      e.stopPropagation();
      mutation.mutate(pollId);
    };
  }

  useEffect(() => {
    if (query.isPending) {
      openLoading('Loading...');
    }
  }, [openLoading, query.isPending]);

  return (
    <Stack p={2} gap={5}>
      {/* first section */}
      <Stack gap={2}>
        <Typography align="center" fontSize={36} fontWeight={700}>
          모두의 설문 조사
        </Typography>
        <Typography
          className="font-maru"
          align="center"
          fontSize={18}
          fontWeight={300}
        >
          자유롭게 묻고 답하고 투표하는{' '}
          <Typography component="span" className="font-monts" fontWeight={700}>
            {BRAND_NAME}
          </Typography>
        </Typography>
      </Stack>
      {/* second section */}
      <Container maxWidth="md">
        <Stack gap={2}>
          <Typography align="center" fontSize={36} fontWeight={700}>
            최근 설문조사
          </Typography>
          <Paper>
            <List>
              {query.data?.map((poll) => (
                <ListItemButton
                  key={poll.id}
                  onClick={() => {
                    navigate('/polls/' + poll.id);
                  }}
                >
                  <ListItemText
                    primary={poll.title}
                    secondary={poll.user?.username || 'Unknown'}
                  />
                  {poll.user?.id === userId && (
                    <Button onClick={handleRemovePoll(poll.id)}>❌</Button>
                  )}
                </ListItemButton>
              ))}
              {query.data?.length === 0 && (
                <ListItemButton>
                  <ListItemText>등록된 설문지가 없습니다.</ListItemText>
                </ListItemButton>
              )}
            </List>
          </Paper>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Home;
