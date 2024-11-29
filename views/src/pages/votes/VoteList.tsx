import { getPolls } from '@/apis/getPolls';
import { getVotes } from '@/apis/getVotes';
import { removeVote } from '@/apis/removeVote';
import { tokenAtom } from '@/recoils/token.atom';
import ListDataItem from '@components/atoms/ListDataItem';
import {
  Container,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface VoteListProps {}
const VoteList: React.FC<VoteListProps> = () => {
  const queryClient = useQueryClient();
  const query = useQuery<APIPoll[]>({
    queryKey: ['votes'],
    queryFn: getVotes,
  });

  const removeMutate = useMutation({
    mutationKey: ['removeVote'],
    mutationFn: removeVote,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['votes'],
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
      </Container>
    </Stack>
  );
};

export default VoteList;
