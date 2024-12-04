import { getVotes } from '@/apis/vote/getVotes';
import ListDataItem from '@components/organisms/ListDataItem';
import { SnapVote } from '@models/SnapVote';
import { Container, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface VoteListProps {}
const VoteList: React.FC<VoteListProps> = () => {
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);
  const { data } = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['votes', page],
    queryFn: getVotes,
  });

  return (
    <Stack>
      <Toolbar />
      <Container>
        {data && (
          <ListDataItem
            name="vote"
            queryKey="votes"
            dataList={data.votes}
            count={data.count}
            emptyComment="등록한 투표지가 없습니다."
          />
        )}
      </Container>
    </Stack>
  );
};

export default VoteList;
