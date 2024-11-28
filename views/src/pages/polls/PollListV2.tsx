import { getPolls } from '@/apis/getPolls';
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

interface PollListV2Props {}
const PollListV2: React.FC<PollListV2Props> = () => {
  const navigate = useNavigate();
  const { user } = useRecoilValue(tokenAtom);
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

  // useEffect(() => {
  //   pollListMutate.mutate();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
          {query?.data?.length === 0 && (
            <ListItem>
              <ListItemText>등록한 설문지가 없습니다.</ListItemText>
            </ListItem>
          )}
        </List>
      </Container>
    </Stack>
  );
};

export default PollListV2;
