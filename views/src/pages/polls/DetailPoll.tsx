import { getPoll } from '@/apis/poll/getPoll';
import { savePollResult } from '@/apis/poll/savePollResult';
import { snapResponseAtom } from '@/recoils/snapResponse.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import PollLayout from '@components/templates/PollLayout';
import useModal from '@hooks/useModal';
import useSocket from '@hooks/useSocket';
import { SnapPoll } from '@models/SnapPoll';
import { SnapResponse } from '@models/SnapResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface DetailPollProps {}
const DetailPoll: React.FC<DetailPollProps> = () => {
  const { sendMessage } = useSocket();
  const { openModal, openInteractiveModal } = useModal();
  const navigate = useNavigate();
  const [{ user }, setToken] = useRecoilState(tokenAtom);
  const [response, setResponse] = useRecoilState(snapResponseAtom);

  const { id } = useParams();

  const { data, isPending } = useQuery<SnapPoll>({
    queryKey: ['poll', id],
    queryFn: () => getPoll(id),
  });

  const saveResponseMutate = useMutation({
    mutationKey: ['saveResponse'],
    mutationFn: savePollResult,
    onSuccess(data, variables, context) {
      // sendMessage({
      //   type: 'pollResponse',
      //   userId: user?.id,
      //   pollId: id,
      // });
      setResponse(new SnapResponse());
      navigate(-1);
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setResponse(new SnapResponse());
        localStorage.setItem('logged_in', 'false');
        setToken({
          signed: false,
          user: undefined,
          token: undefined,
          expired: true,
        });
        navigate('/');
      }
    },
  });

  function handleSavePollResult(e: FormEvent) {
    e.preventDefault();

    if (!id) return;

    openInteractiveModal('작성을 완료하시겠습니까?', () => {
      const answerLength = response.answer.length;
      if (answerLength === 0) {
        openModal(Message.Require.LeastResponse);
        return false;
      }

      const answered = data?.question.every((question) => {
        if (!question.isRequired) return true;
        const answer = response.answer.find(
          (answer) => answer.questionId === question.id,
        );
        return !!answer;
      });
      if (!answered) {
        openModal(Message.Require.MustFill);
        return false;
      }
      const copyResponse = SnapResponse.copy(response);
      copyResponse.userId = user?.id;
      copyResponse.pollId = id;
      saveResponseMutate.mutate(copyResponse);
    });

    return false;
  }

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
        {data && <PollLayout poll={data} />}
        <Divider />
        <Button variant="contained" size="large" type="submit">
          제출
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

export default DetailPoll;
