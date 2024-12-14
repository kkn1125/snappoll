import { getVotes } from '@/apis/vote/getVotes';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapVote } from '@models/SnapVote';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface VoteListPageProps {}
const VoteListPage: React.FC<VoteListPageProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<
    SnapResponseType<{ votes: SnapVote[]; count: number }>
  >({
    queryKey: ['votes', page],
    queryFn: getVotes,
  });
  const responseData = data?.data;

  if (isLoading) return <SkeletonMeList />;

  return (
    responseData?.votes && (
      <ListDataItem
        name="vote"
        queryKey="votes"
        dataList={responseData.votes}
        count={responseData.count}
        emptyComment="등록한 투표지가 없습니다."
      />
    )
  );
};

export default VoteListPage;
