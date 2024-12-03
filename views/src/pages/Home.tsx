import { getPolls } from '@/apis/poll/getPolls';
import { removePoll } from '@/apis/removePoll';
import { tokenAtom } from '@/recoils/token.atom';
import { BRAND_NAME } from '@common/variables';
import ListItemIcons from '@components/atoms/ListItemIcons';
import { SnapPoll } from '@models/SnapPoll';
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const Home = () => {
  const { user } = useRecoilValue(tokenAtom);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['polls'],
    queryFn: getPolls,
  });

  const removeMutation = useMutation({
    mutationKey: ['polls-remove'],
    mutationFn: (pollId: string) => removePoll(pollId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });

  function handleRemovePoll(pollId: string) {
    return (e: MouseEvent) => {
      e.stopPropagation();
      removeMutation.mutate(pollId);
    };
  }

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
              {data?.polls.slice(0, 5).map((poll, i) => (
                <ListItem
                  disablePadding
                  key={poll.id}
                  secondaryAction={
                    poll.user?.id === user?.id && (
                      <ListItemIcons
                        dataId={poll.id}
                        type="poll"
                        handleRemove={handleRemovePoll}
                      />
                    )
                  }
                  sx={{
                    ['& .MuiListItemSecondaryAction-root']: {
                      transition: '150ms ease-in-out',
                      opacity: 0,
                    },
                    ['&:hover .MuiListItemSecondaryAction-root']: {
                      opacity: 1,
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate('/polls/' + poll.id);
                    }}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontWeight: 700 }}
                      primary={i + 1 + '. ' + poll.title}
                      secondary={poll.user?.username || 'Unknown'}
                    />
                    {/* {poll.user?.id === user?.id && (
                      <Button onClick={handleRemovePoll(poll.id)}>❌</Button>
                    )} */}
                  </ListItemButton>
                </ListItem>
              ))}
              {data?.polls.length === 0 && (
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
