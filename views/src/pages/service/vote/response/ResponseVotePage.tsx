import { tokenAtom } from '@/recoils/token.atom';
import { getVoteResponse } from '@apis/vote/response/getVoteResponse';
import { getVoteResponseMe } from '@apis/vote/response/getVoteResponseMe';
import { removeVoteResponse } from '@apis/vote/response/removeVoteResponse';
import { Message } from '@common/messages';
import CommonPagination from '@components/atoms/CommonPagination';
import SkeletonResponseList from '@components/moleculars/SkeletonResponseList';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  AlertTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { getUsernameOr } from '@utils/getUsernameOr';
import { validateExpired } from '@utils/validateExpired';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface ResponseVotePageProps {
  me?: boolean;
}
const ResponseVotePage: React.FC<ResponseVotePageProps> = ({ me }) => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const { id } = useParams();
  const { openInteractiveModal } = useModal();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);

  const { data, isLoading } = useQuery<
    SnapResponseType<{
      vote: SnapVote;
      responses: SnapVoteResponse[];
      count: number;
    }>
  >({
    queryKey: ['voteResponse', id],
    queryFn: () => (me ? getVoteResponseMe() : getVoteResponse(id)),
  });
  const responseData = data?.data;
  const total = responseData ? Math.ceil(responseData.count / 10) : 0;

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
      const username = getUsernameOr(response?.user?.username);
      return username === user?.username ? '나' : username;
    },
    [user?.username],
  );

  const handleRemove = useCallback((responseId: string) => {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback: () => {
        removeMutation.mutate(responseId);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isExpired = useMemo(() => {
    return validateExpired(responseData?.vote?.expiresAt);
  }, [responseData?.vote?.expiresAt]);

  if (isLoading) return <SkeletonResponseList />;

  return (
    <Stack gap={3}>
      {isExpired && (
        <Alert severity="warning">
          <AlertTitle>안내</AlertTitle>
          마감된 투표입니다.
        </Alert>
      )}

      <List>
        {responseData?.responses.slice(0, 10).map((response, i) => (
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
              onClick={() =>
                navigate(
                  `/service/vote/${me ? response.voteId : id}/response/${response.id}`,
                )
              }
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

        {responseData?.responses.length === 0 && (
          <ListItem>
            <ListItemButton>
              <ListItemText>
                {me
                  ? '아직 응답한 투표가 없습니다.'
                  : '아직 투표에 참여한 사람이 없습니다.'}
              </ListItemText>
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <CommonPagination total={total} />
    </Stack>
  );
};

export default ResponseVotePage;
