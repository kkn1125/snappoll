import { getVotes } from '@/apis/vote/getVotes';
import ListDataItem from '@components/atoms/ListDataItem';
import { SnapVote } from '@models/SnapVote';
import { Container, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface VoteListProps {}
const VoteList: React.FC<VoteListProps> = () => {
  const { data } = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['votes'],
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
