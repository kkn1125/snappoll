import { getPolls } from '@/apis/getPolls';
import { removePoll } from '@/apis/removePoll';
import ListDataItem from '@components/atoms/ListDataItem';
import { Container, List, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface PollListV2Props {}
const PollListV2: React.FC<PollListV2Props> = () => {
  const queryClient = useQueryClient();
  const query = useQuery<APIPoll[]>({
    queryKey: ['polls'],
    queryFn: getPolls,
  });

  const removeMutate = useMutation({
    mutationKey: ['removePoll'],
    mutationFn: removePoll,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['polls'],
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

export default PollListV2;
