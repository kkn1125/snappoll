import { getMyPolls } from '@/apis/poll/getMyPolls';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { Container, List, Stack, Toolbar } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface MyPollsProps {}
const MyPolls: React.FC<MyPollsProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data } = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['my-polls', page],
    queryFn: getMyPolls,
  });

  return (
    <Stack>
      <Toolbar />
      <Container>
        <List>
          {data?.polls && (
            <ListDataItem
              name="poll"
              queryKey="my-polls"
              dataList={data.polls}
              count={data.count}
              emptyComment="등록한 설문지가 없습니다."
            />
          )}
        </List>
      </Container>
    </Stack>
  );
};

export default MyPolls;
