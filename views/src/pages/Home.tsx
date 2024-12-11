import { getPolls } from '@/apis/poll/getPolls';
import { getVotes } from '@/apis/vote/getVotes';
import { BRAND_NAME } from '@common/variables';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import { Container, List, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
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
      {/* <Stack gap={2}>
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
      </Stack> */}
      {/* second section */}
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

export default Home;
