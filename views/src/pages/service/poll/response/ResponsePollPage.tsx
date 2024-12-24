import { getPollResponse } from '@apis/poll/response/getPollResponse';
import { getPollResponseMe } from '@apis/poll/response/getPollResponseMe';
import { removeResponse } from '@apis/poll/response/removeResponse';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import CommonPagination from '@components/atoms/CommonPagination';
import SkeletonResponseList from '@components/moleculars/SkeletonResponseList';
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
import { getUsernameOr } from '@utils/getUsernameOr';
import { Logger } from '@utils/Logger';
import { validateExpired } from '@utils/validateExpired';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const logger = new Logger('ResponsePollPage');

interface ResponsePollPageProps {
  me?: boolean;
}
const ResponsePollPage: React.FC<ResponsePollPageProps> = ({ me }) => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const { openInteractiveModal } = useModal();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams({ page: '1' });
  const page = +(params.get('page') || 1);

  const { data, isLoading } = useQuery<
    SnapResponseType<{
      poll: SnapPoll;
      responses: SnapResponse[];
      count: number;
    }>
  >({
    queryKey: ['pollResponses', id, page],
    queryFn: () => (me ? getPollResponseMe(page) : getPollResponse(id, page)),
  });
  const responseData = data?.data;
  const total = responseData ? Math.ceil(responseData.count / 10) : 0;
  const removeMutation = useMutation({
    mutationKey: ['removeMutate'],
    mutationFn: removeResponse,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ['pollResponses'] });
    },
  });

  logger.debug('data:', data);

  const getTitle = useCallback((response: SnapResponse) => {
    return response.poll?.title;
  }, []);

  const getUser = useCallback(
    (response: SnapResponse) => {
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
    return validateExpired(responseData?.poll?.expiresAt);
  }, [responseData?.poll?.expiresAt]);

  if (isLoading) return <SkeletonResponseList />;

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        {isExpired && (
          <Alert severity="warning">
            <AlertTitle>안내</AlertTitle>
            마감된 설문입니다.
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
                    `/service/poll/${me ? response.pollId : id}/response/${response.id}`,
                  )
                }
              >
                <Stack direction="row" gap={3} flexWrap="wrap">
                  <Typography>{i + 1 + (page - 1) * 10}.</Typography>
                  <Typography flex={1}>{getTitle(response)}</Typography>
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
                    ? '아직 응답한 설문이 없습니다.'
                    : '아직 설문조사에 참여한 사람이 없습니다.'}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <CommonPagination total={total} />
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

export default ResponsePollPage;
