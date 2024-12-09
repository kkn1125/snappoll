import { getPollResponse } from '@/apis/poll/response/getPollResponse';
import { getPollResponseMe } from '@/apis/poll/response/getPollResponseMe';
import { removeResponse } from '@/apis/poll/response/removeResponse';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapPoll } from '@models/SnapPoll';
import { SnapResponse } from '@models/SnapResponse';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { validateExpired } from '@utils/validateExpired';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PollResponseProps {
  me?: boolean;
}
const PollResponse: React.FC<PollResponseProps> = ({ me }) => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const { openInteractiveModal } = useModal();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery<{
    poll: SnapPoll;
    responses: SnapResponse[];
    count: number;
  }>({
    queryKey: ['pollResponses', id],
    queryFn: () => (me ? getPollResponseMe() : getPollResponse(id)),
  });

  const removeMutation = useMutation({
    mutationKey: ['removeMutate'],
    mutationFn: removeResponse,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['pollResponses'] });
    },
  });

  const getTitle = useCallback((response: SnapResponse) => {
    return response.poll?.title;
  }, []);

  const getUser = useCallback(
    (response: SnapResponse) => {
      return response.user
        ? response.user.username === user?.username
          ? '나'
          : response.user.username
        : 'Unknown';
    },
    [user?.username],
  );

  const handleRemove = useCallback((responseId: string) => {
    openInteractiveModal(Message.Single.Remove, () => {
      removeMutation.mutate(responseId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isExpired = useMemo(() => {
    return validateExpired(data?.poll?.expiresAt);
  }, [data?.poll?.expiresAt]);

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        <List>
          {data?.responses.map((response, i) => (
            <ListItem
              key={response.id}
              secondaryAction={
                user?.id === response.userId && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(response.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                onClick={() => navigate(`/polls/${id}/response/${response.id}`)}
              >
                <Stack direction="row" gap={3}>
                  <Typography>{i + 1}.</Typography>
                  <Typography>{getTitle(response)}</Typography>
                  <Typography>{getUser(response)}</Typography>
                  <Typography>{formattedDate(response.createdAt)}</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
          {isExpired && (
            <Alert severity="warning">
              <AlertTitle>안내</AlertTitle>
              마감된 설문입니다.
            </Alert>
          )}
          {data?.responses.length === 0 && (
            <ListItem>
              <ListItemButton>
                <ListItemText>
                  {me
                    ? '아직 응답한 설문이 없습니다.'
                    : '아직 설문조사에 참여한 사람이 없습니다.'}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        <Button
          variant="contained"
          size="large"
          type="button"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          이전으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default PollResponse;
