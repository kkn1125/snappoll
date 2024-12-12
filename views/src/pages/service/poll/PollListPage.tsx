import { getPolls } from '@/apis/poll/getPolls';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface PollListPageProps {}
const PollListPage: React.FC<PollListPageProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<{ polls: SnapPoll[]; count: number }>({
    queryKey: ['polls', page],
    queryFn: getPolls,
  });

  if (!data || isLoading) return <SkeletonMeList />;

  return (
    <ListDataItem
      name="poll"
      queryKey="polls"
      dataList={data.polls}
      count={data.count}
      emptyComment="등록한 설문지가 없습니다."
    />
  );
};

export default PollListPage;
