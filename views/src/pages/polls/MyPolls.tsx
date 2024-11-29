import { getMyPolls } from '@/apis/getMyPolls';
import { removePoll } from '@/apis/removePoll';
import ListDataItem from '@components/atoms/ListDataItem';
import { Button, Container, List, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface MyPollsProps {}
const MyPolls: React.FC<MyPollsProps> = () => {
  const queryClient = useQueryClient();
  const query = useQuery<APIPoll[]>({
    queryKey: ['my-polls'],
    queryFn: getMyPolls,
  });

  const removeMutate = useMutation({
    mutationKey: ['removePoll'],
    mutationFn: removePoll,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['my-polls'],
      });
    },
  });

  function handleRemove(id: string) {
    removeMutate.mutate(id);
  }

  return (
    <Stack>
      <Toolbar />
      <Container>
        <List>
          {query.data && (
            <ListDataItem
              name="poll"
              dataList={query.data}
              removeMethod={handleRemove}
              queryKey="polls"
              mutationKey="pollRemove"
              emptyComment="등록한 설문지가 없습니다."
            />
          )}
        </List>
      </Container>
    </Stack>
  );
};

export default MyPolls;
