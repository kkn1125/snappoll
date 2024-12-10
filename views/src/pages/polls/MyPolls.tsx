import { getMyPolls } from '@/apis/poll/getMyPolls';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { Container, List, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface MyPollsProps {}
const MyPolls: React.FC<MyPollsProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['my-polls', page],
    queryFn: getMyPolls,
  });

  if (isLoading) return <SkeletonMeList />;

  return (
    <Stack>
      {data?.polls && (
        <ListDataItem
          name="poll"
          queryKey="my-polls"
          dataList={data.polls}
          count={data.count}
          emptyComment="등록한 설문지가 없습니다."
        />
      )}
    </Stack>
  );
};

export default MyPolls;
