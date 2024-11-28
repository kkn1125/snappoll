import { getMyPolls } from '@/apis/getMyPolls';
import { removePoll } from '@/apis/removePoll';
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

interface MyPollsProps {}
const MyPolls: React.FC<MyPollsProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
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
          {query?.data?.map((poll) => (
            <ListItem
              key={poll.id}
              secondaryAction={
                poll.user?.id === user?.id && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={() => handleRemove(poll.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton onClick={() => navigate(`/polls/${poll.id}`)}>
                <ListItemText>{poll.title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Container>
    </Stack>
  );
};

export default MyPolls;
