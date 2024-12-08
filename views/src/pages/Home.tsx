import { getPolls } from '@/apis/poll/getPolls';
import { BRAND_NAME } from '@common/variables';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { Container, List, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

const Home = () => {
  const { data } = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['polls'],
    queryFn: getPolls,
  });

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

          <List>
            {data && (
              <ListDataItem
                name="poll"
                queryKey="polls"
                dataList={data.polls}
                count={data.count}
                emptyComment="등록한 설문지가 없습니다."
                disableCreateButton
              />
            )}
          </List>
        </Stack>
      </Container>
    </Stack>
  );
};

export default Home;
