import { getMyVotes } from '@/apis/vote/getMyVotes';
import ListDataItem from '@components/atoms/ListDataItem';
import { SnapVote } from '@models/SnapVote';
import { Container, List, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface MyVotesProps {}
const MyVotes: React.FC<MyVotesProps> = () => {
  const { data } = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['my-votes'],
    queryFn: getMyVotes,
  });

  return (
    <Stack>
      <Toolbar />
      <Container>
        <List>
          {data && (
            <ListDataItem
              name="vote"
              queryKey="votes"
              dataList={data.votes}
              count={data.count}
              emptyComment="등록한 투표지가 없습니다."
            />
          )}
        </List>
      </Container>
    </Stack>
  );
};

export default MyVotes;
