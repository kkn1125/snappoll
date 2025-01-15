import { getPolls } from '@apis/poll/getPolls';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { useQuery } from '@tanstack/react-query';
import { Logger } from '@utils/Logger';
import { useSearchParams } from 'react-router-dom';

const logger = new Logger('PollListPage');

interface PollListPageProps {}
const PollListPage: React.FC<PollListPageProps> = () => {
  const [params] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<
    SnapResponseType<{ polls: SnapPoll[]; count: number }>
  >({
    queryKey: ['polls', page],
    queryFn: getPolls,
  });
  const responseData = data?.data;

  if (isLoading) return <SkeletonMeList />;

  return (
    responseData?.polls && (
      <ListDataItem
        name="poll"
        queryKey="polls"
        searchbar
        disableCreateButton
        disableMyResponse
        dataList={responseData.polls}
        count={responseData.count}
        emptyComment="등록한 설문지가 없습니다."
      />
    )
  );
};

export default PollListPage;
