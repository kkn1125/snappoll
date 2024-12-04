import { getPolls } from '@/apis/poll/getPolls';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { Container, List, Stack, Toolbar } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PollListV2Props {}
const PollListV2: React.FC<PollListV2Props> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data } = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['polls', page],
    queryFn: getPolls,
  });

  return (
    <Stack>
      <Toolbar />
      <Container>
        {data && (
          <ListDataItem
            name="poll"
            queryKey="polls"
            dataList={data.polls}
            count={data.count}
            emptyComment="등록한 설문지가 없습니다."
          />
        )}
      </Container>
    </Stack>
  );
};

export default PollListV2;
