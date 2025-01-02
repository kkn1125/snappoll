import { getMyPollResults } from '@apis/poll/getMyPollResults';
import { getPolls } from '@apis/poll/getPolls';
import { getMyVoteResults } from '@apis/vote/getMyVoteResults';
import { getVotes } from '@apis/vote/getVotes';
import ResponsiveChart from '@components/atoms/ResponsiveChart';
import useToken from '@hooks/useToken';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import {
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const HomePage = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('lg'));
  const { user } = useToken();
  const poll = useQuery<
    SnapResponseType<{
      weeks: string[];
      pollCount: number;
      pollResponseCount: number;
      responsesWeek: number[];
      respondentWeek: number[];
    }>
  >({
    queryKey: ['polls'],
    queryFn: getMyPollResults,
  });
  const vote = useQuery<
    SnapResponseType<{
      weeks: string[];
      voteCount: number;
      voteResponseCount: number;
      responsesWeek: number[];
      respondentWeek: number[];
    }>
  >({
    queryKey: ['votes'],
    queryFn: getMyVoteResults,
  });
  const pollData = poll.data?.data;
  const voteData = vote.data?.data;

  const getDates = useMemo(() => {
    const now = dayjs();
    const todayNumber = now.day();
    const sunday = now.add(6 - todayNumber, 'd');
    return Array.from(Array(7), (_, i) => {
      return sunday.subtract(7 - i - 1, 'day').format('YYYY-MM-DD');
    });
  }, []);

  return (
    <Stack gap={5}>
      {/* first section */}
      <Stack gap={2}>
        <Typography variant="h5" fontWeight="bold">
          나의 설문, 투표
        </Typography>
        <Stack direction="row" gap={2}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {pollData?.pollCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              생성한 설문 수
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {voteData?.voteCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              생성한 투표 수
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {pollData?.pollResponseCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              응답한 설문 수
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {voteData?.voteResponseCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              응답한 투표 수
            </Typography>
          </Paper>
        </Stack>
      </Stack>

      <Divider />

      <Stack gap={2}>
        {/* todo: section1 : 최근 7일간 설문 응답자 그래프(일별로 몇명 응답했는지 선형그래프) */}
        {/* todo: section2 : 최근 7일간 투표 응답자 그래프(일별로 몇명 응답했는지 선형그래프) */}
        <Stack direction={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>
          <Stack flex={1}>
            <Stack alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight="bold">
                내가 응답한 설문, 투표 (주간)
              </Typography>
            </Stack>
            <Stack gap={2}>
              <Stack height={300}>
                {pollData && voteData && (
                  <ResponsiveChart
                    dates={pollData.weeks ?? getDates}
                    responseData={[
                      {
                        type: 'line',
                        data: pollData.responsesWeek,
                        label: '설문 응답',
                      },
                      {
                        type: 'line',
                        data: voteData?.responsesWeek,
                        label: '투표 응답',
                      },
                    ]}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>

          <Stack flex={1}>
            <Stack alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight="bold">
                나의 설문, 투표에 응답한 사람 (주간)
              </Typography>
            </Stack>
            <Stack gap={2}>
              <Stack height={300}>
                {pollData && voteData && (
                  <ResponsiveChart
                    dates={pollData.weeks ?? getDates}
                    responseData={[
                      {
                        type: 'line',
                        data: pollData.respondentWeek,
                        label: '설문 응답자',
                      },
                      {
                        type: 'line',
                        data: voteData?.respondentWeek,
                        label: '투표 응답자',
                      },
                    ]}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* <Stack gap={2}>
        <Stack gap={2}>
        <List>
          {pollData && (
            <ListDataItem
              name="poll"
              queryKey="polls"
              dataList={pollData.polls}
              count={pollData.count}
              emptyComment="등록한 설문지가 없습니다."
              disableCreateButton
              limit={3}
            />
          )}
        </List>
      </Stack>
      <Stack gap={2}>
        <List>
          {voteData && (
            <ListDataItem
              name="vote"
              queryKey="votes"
              dataList={voteData.votes}
              count={voteData.count}
              emptyComment="등록한 설문지가 없습니다."
              disableCreateButton
              limit={3}
            />
          )}
        </List>
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default HomePage;
