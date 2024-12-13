import { getPolls } from '@/apis/poll/getPolls';
import { getVotes } from '@/apis/vote/getVotes';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import { List, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
  const poll = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['polls'],
    queryFn: getPolls,
  });
  const vote = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['votes'],
    queryFn: getVotes,
  });

  return (
    <Stack gap={5}>
      {/* first section */}

      <Stack gap={2}>
        <Typography align="center" fontSize={36} fontWeight={700}>
          최근 설문조사
        </Typography>

        <List>
          {poll.data && (
            <ListDataItem
              name="poll"
              queryKey="polls"
              dataList={poll.data.polls}
              count={poll.data.count}
              emptyComment="등록한 설문지가 없습니다."
              disableCreateButton
              limit={3}
            />
          )}
        </List>
      </Stack>
      <Stack gap={2}>
        <Typography align="center" fontSize={36} fontWeight={700}>
          최근 투표
        </Typography>

        <List>
          {vote.data && (
            <ListDataItem
              name="vote"
              queryKey="votes"
              dataList={vote.data.votes}
              count={vote.data.count}
              emptyComment="등록한 설문지가 없습니다."
              disableCreateButton
              limit={3}
            />
          )}
        </List>
      </Stack>
    </Stack>
  );
};

export default HomePage;
