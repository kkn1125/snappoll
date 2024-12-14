import { getMyPolls } from '@/apis/poll/getMyPolls';
import SkeletonMeList from '@components/moleculars/SkeletonMeList';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapPoll } from '@models/SnapPoll';
import { Container, List, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Logger } from '@utils/Logger';
import { useSearchParams } from 'react-router-dom';

const logger = new Logger('MyPollPage');

interface MyPollPageProps {}
const MyPollPage: React.FC<MyPollPageProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data, isLoading } = useQuery<
    SnapResponseType<{ polls: SnapPoll[]; count: number }>
  >({
    queryKey: ['my-polls', page],
    queryFn: getMyPolls,
  });
  const responseData = data?.data;

  if (isLoading) return <SkeletonMeList />;

  return (
    <Stack>
      {responseData?.polls && (
        <ListDataItem
          name="poll"
          queryKey="my-polls"
          dataList={responseData.polls}
          count={responseData.count}
          emptyComment="등록한 설문지가 없습니다."
        />
      )}
    </Stack>
  );
};

export default MyPollPage;
