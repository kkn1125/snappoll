import { getMyVotes } from '@/apis/vote/getMyVotes';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapVote } from '@models/SnapVote';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface MyVotesProps {}
const MyVotes: React.FC<MyVotesProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['my-votes', page],
    queryFn: getMyVotes,
  });

  if (!data || isLoading) return <SkeletonMeList />;

  return (
    <ListDataItem
      name="vote"
      queryKey="my-votes"
      dataList={data.votes}
      count={data.count}
      emptyComment="등록한 투표지가 없습니다."
    />
  );
};

export default MyVotes;
