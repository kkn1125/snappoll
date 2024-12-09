import { getVoteResponse } from '@/apis/vote/response/getVoteResponse';
import { getVoteResponseMe } from '@/apis/vote/response/getVoteResponseMe';
import { removeVoteResponse } from '@/apis/vote/response/removeVoteResponse';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
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

interface VoteResponseProps {
  me?: boolean;
}
const VoteResponse: React.FC<VoteResponseProps> = ({ me }) => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const { id } = useParams();
  const { openInteractiveModal } = useModal();
  const queryClient = useQueryClient();
  const { data } = useQuery<{
    vote: SnapVote;
    responses: SnapVoteResponse[];
    count: number;
  }>({
    queryKey: ['voteResponse', id],
    queryFn: () => (me ? getVoteResponseMe() : getVoteResponse(id)),
  });

  const removeMutation = useMutation({
    mutationKey: ['removeMutate'],
    mutationFn: removeVoteResponse,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['voteResponse'] });
    },
  });

  const getTitle = useCallback((response: SnapVoteResponse) => {
    return response.vote?.title;
  }, []);

  const getUser = useCallback(
    (response?: SnapVoteResponse) => {
      return response?.user
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
    return validateExpired(data?.vote?.expiresAt);
  }, [data?.vote?.expiresAt]);

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
                onClick={() => navigate(`/votes/${id}/response/${response.id}`)}
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
              마감된 투표입니다.
            </Alert>
          )}
          {data?.responses.length === 0 && (
            <ListItem>
              <ListItemButton>
                <ListItemText>아직 투표에 참여한 사람이 없습니다.</ListItemText>
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

export default VoteResponse;
