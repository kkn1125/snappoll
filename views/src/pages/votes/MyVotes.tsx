import { getMyVotes } from '@/apis/getMyVotes';
import { removeVote } from '@/apis/removeVote';
import { tokenAtom } from '@/recoils/token.atom';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface MyVotesProps {}
const MyVotes: React.FC<MyVotesProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
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
          {query?.data?.map((vote) => (
            <ListItem
              key={vote.id}
              secondaryAction={
                vote.user?.id === user?.id && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={() => handleRemove(vote.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton onClick={() => navigate(`/votes/${vote.id}`)}>
                <ListItemText>{vote.title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
          {query?.data?.length === 0 && (
            <ListItem>
              <ListItemText>등록한 투표지가 없습니다.</ListItemText>
            </ListItem>
          )}
        </List>
      </Container>
    </Stack>
  );
};

export default MyVotes;
