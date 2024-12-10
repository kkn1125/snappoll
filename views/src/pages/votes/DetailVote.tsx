import { getVote } from '@/apis/vote/getVote';
import { saveVoteResult } from '@/apis/vote/saveVoteResult';
import { getShareVoteBy } from '@/apis/vote/share/getShareVoteBy';
import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import VoteLayout from '@components/templates/VoteLayout';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { validateExpired } from '@utils/validateExpired';
import { AxiosError } from 'axios';
import { FormEvent, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface DetailVoteProps {
  voteId?: string;
  refetchShare?: () => void;
}
const DetailVote: React.FC<DetailVoteProps> = ({ voteId, refetchShare }) => {
  const { user, logoutToken } = useToken();
  const { openInteractiveModal } = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [response, setResponse] = useRecoilState(snapVoteResponseAtom);

  const { id } = useParams();
  const detailId = voteId || id;

  const { data, isPending } = useQuery<SnapVote>({
    queryKey: ['vote', detailId],
    queryFn: () => (voteId ? getShareVoteBy(detailId) : getVote(detailId)),
  });

  const saveResponseMutate = useMutation({
    mutationKey: ['saveResponse'],
    mutationFn: saveVoteResult,
    onSuccess(data, variables, context) {
      setResponse(new SnapVoteResponse());
      navigate(-1);
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setResponse(new SnapVoteResponse());
        logoutToken();
        navigate('/');
      }
    },
  });

  const refetchVote = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['vote'],
    });
    refetchShare?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSavePollResult = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!data?.id) return;

      openInteractiveModal('작성을 완료하시겠습니까?', () => {
        const copyResponse = SnapVoteResponse.copy(response);
        copyResponse.userId = user?.id;
        copyResponse.voteId = data?.id;
        saveResponseMutate.mutate(copyResponse);
      });

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.id, response, user],
  );

  const isExpired = useMemo(() => {
    return validateExpired(data?.expiresAt);
  }, [data]);

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
        {data && (
          <VoteLayout
            vote={data}
            expired={isExpired}
            refetchVote={refetchVote}
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

export default DetailVote;
