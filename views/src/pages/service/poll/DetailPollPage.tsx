import { getPoll } from '@apis/poll/getPoll';
import { savePollResult } from '@apis/poll/savePollResult';
import { getSharePollBy } from '@apis/poll/share/getSharePollBy';
import { snapResponseAtom } from '@/recoils/snapResponse.atom';
import { Message } from '@common/messages';
import PollLayout from '@components/templates/PollLayout';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { SnapPoll } from '@models/SnapPoll';
import { SnapResponse } from '@models/SnapResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { validateExpired } from '@utils/validateExpired';
import { AxiosError } from 'axios';
import { FormEvent, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface DetailPollPageProps {
  pollId?: string;
  refetchShare?: () => void;
}
const DetailPollPage: React.FC<DetailPollPageProps> = ({
  pollId,
  refetchShare,
}) => {
  const { user, logoutToken } = useToken();
  const { openModal, openInteractiveModal } = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [response, setResponse] = useRecoilState(snapResponseAtom);

  const { id } = useParams();
  const detailId = pollId || id;

  const { data, isPending } = useQuery<SnapResponseType<SnapPoll>>({
    queryKey: ['poll', detailId],
    queryFn: () => (pollId ? getSharePollBy(detailId) : getPoll(detailId)),
  });
  const responseData = data?.data;

  const saveResponseMutate = useMutation({
    mutationKey: ['saveResponse'],
    mutationFn: savePollResult,
    onSuccess(data, variables, context) {
      if (pollId !== undefined) {
        /* 비회원 */
        openInteractiveModal({
          content: Message.Info.SuccessResponse,
          callback: () => {
            setResponse(new SnapResponse());
            navigate('/');
          },
          closeCallback: () => {
            setResponse(new SnapResponse());
          },
        });
      } else {
        /* 회원 */
        setResponse(new SnapResponse());
        navigate(-1);
      }
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response?.status === 401) {
        setResponse(new SnapResponse());
        logoutToken();
        navigate('/');
      }
    },
  });

  const refetchPoll = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['poll'],
    });
    refetchShare?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSavePollResult = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!responseData?.id) return;

      openInteractiveModal({
        content: '작성을 완료하시겠습니까?',
        callback: () => {
          const answerLength = response.answer.length;
          if (answerLength === 0) {
            openModal({ info: Message.Require.LeastResponse });
            return false;
          }

          const answered = responseData?.question.every((question) => {
            if (!question.isRequired) return true;
            const answer = response.answer.find(
              (answer) => answer.questionId === question.id,
            );
            return !!answer;
          });
          if (!answered) {
            openModal({ info: Message.Require.MustFill });
            return false;
          }
          const copyResponse = SnapResponse.copy(response);
          copyResponse.userId = user?.id;
          copyResponse.pollId = responseData?.id;
          saveResponseMutate.mutate(copyResponse);
        },
      });

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [responseData?.id, responseData?.question, response, user?.id],
  );

  const isExpired = useMemo(() => {
    return validateExpired(responseData?.expiresAt);
  }, [responseData]);

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
        {responseData && (
          <PollLayout
            poll={responseData}
            expired={isExpired}
            refetchPoll={refetchPoll}
          />
        )}
        <Divider />
        <Button
          disabled={isExpired}
          variant="contained"
          size="large"
          type="submit"
        >
          {isExpired ? '마감된 설문입니다.' : '제출'}
        </Button>
        <Button
          variant="contained"
          size="large"
          type="button"
          color="inherit"
          onClick={() => {
            history.back();
          }}
        >
          이전으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default DetailPollPage;
