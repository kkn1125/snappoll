import { getMyVotes } from '@/apis/getMyVotes';
import { removeVote } from '@/apis/removeVote';
import ListDataItem from '@components/atoms/ListDataItem';
import { Button, Container, List, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface MyVotesProps {}
const MyVotes: React.FC<MyVotesProps> = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Vote[]>({
    queryKey: ['my-votes'],
    queryFn: getMyVotes,
  });

  const remoteMutate = useMutation({
    mutationKey: ['removeVote'],
    mutationFn: removeVote,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['my-votes'],
      });
    },
  });

  function handleRemove(id: string) {
    remoteMutate.mutate(id);
  }

  return (
    <Stack>
      <Toolbar />
      <Container>
        <List>
          {query.data && (
            <ListDataItem
              name="vote"
              dataList={query.data}
              removeMethod={handleRemove}
              queryKey="votes"
              mutationKey="voteRemove"
              emptyComment="등록한 투표지가 없습니다."
            />
          )}
        </List>
      </Container>
    </Stack>
  );
};

export default MyVotes;
