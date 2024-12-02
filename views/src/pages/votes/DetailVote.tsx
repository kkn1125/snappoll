import { getVote } from '@/apis/vote/getVote';
import { saveVoteResult } from '@/apis/vote/saveVoteResult';
import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import VoteLayout from '@components/templates/VoteLayout';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface DetailVoteProps {}
const DetailVote: React.FC<DetailVoteProps> = () => {
  const { openModal, openInteractiveModal } = useModal();
  const navigate = useNavigate();
  const [{ user }, setToken] = useRecoilState(tokenAtom);
  const [responses, setResponses] = useRecoilState(snapVoteResponseAtom);

  const { id } = useParams();

  const { data, isPending } = useQuery<SnapVote>({
    queryKey: ['vote', id],
    queryFn: () => getVote(id),
  });

  const saveResponseMutate = useMutation({
    mutationKey: ['saveResponse'],
    mutationFn: saveVoteResult,
    onSuccess(data, variables, context) {
      setResponses([]);
      console.log(data);
      navigate(-1);
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setResponses([]);
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
      const answerLength = responses.length;
      if (answerLength === 0) {
        openModal(Message.Require.LeastResponse);
        return false;
      }
      const copyResponses = responses.map((response) => {
        const copyResponse = SnapVoteResponse.copy(response);
        copyResponse.userId = user?.id;
        copyResponse.voteId = id;
        return copyResponse;
      });
      saveResponseMutate.mutate(copyResponses);
    });

    return false;
  }
  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
        {data && <VoteLayout vote={data} />}
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

export default DetailVote;
