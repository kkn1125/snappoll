import { getMyVotes } from '@/apis/vote/getMyVotes';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapVote } from '@models/SnapVote';
import { useQuery } from '@tanstack/react-query';
import { Logger } from '@utils/Logger';
import { useSearchParams } from 'react-router-dom';

const logger = new Logger('MyVotePage');

interface MyVotePageProps {}
const MyVotePage: React.FC<MyVotePageProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<
    SnapResponseType<{ votes: SnapVote[]; count: number }>
  >({
    queryKey: ['my-votes', page],
    queryFn: getMyVotes,
  });
  const responseData = data?.data;

  if (!data || isLoading) return <SkeletonMeList />;

  return (
    responseData?.votes && (
      <ListDataItem
        name="vote"
        queryKey="my-votes"
        dataList={responseData.votes}
        count={responseData.count}
        emptyComment="등록한 투표지가 없습니다."
      />
    )
  );
};

export default MyVotePage;
