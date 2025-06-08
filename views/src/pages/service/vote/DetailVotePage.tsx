import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { getVote } from '@apis/vote/getVote';
import { saveVoteResult } from '@apis/vote/saveVoteResult';
import { getShareVoteBy } from '@apis/vote/share/getShareVoteBy';
import { Message } from '@common/messages';
import { guestAllowPaths } from '@common/variables';
import VoteLayout from '@components/templates/VoteLayout';
import useLogger from '@hooks/useLogger';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { validateExpired } from '@utils/validateExpired';
import { AxiosError } from 'axios';
import { FormEvent, useCallback, useMemo } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface DetailVotePageProps {
  voteId?: string;
  refetchShare?: () => void;
}
const DetailVotePage: React.FC<DetailVotePageProps> = ({
  voteId,
  refetchShare,
}) => {
  const { debug } = useLogger('DetailVotePage');
  const { user, logoutToken } = useToken();
  const { openModal, openInteractiveModal } = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [response, setResponse] = useRecoilState(snapVoteResponseAtom);
  const locate = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isShare =
    searchParams.get('url') &&
    !!voteId &&
    !!locate.pathname.match(guestAllowPaths);
  const detailId = voteId || id;

  const { data, isPending } = useQuery<SnapResponseType<SnapVote>>({
    queryKey: ['vote', detailId],
    queryFn: () => (voteId ? getShareVoteBy(detailId) : getVote(detailId)),
  });
  const responseData = data?.data;
  const alreadyResponded = useMemo(() => {
    return (responseData?._count?.voteResponse || 0) > 0;
  }, [responseData?._count?.voteResponse]);
  const saveResponseMutate = useMutation({
    mutationKey: ['saveResponse'],
    mutationFn: saveVoteResult,
    onSuccess(data, variables, context) {
      if (voteId !== undefined) {
        /* 비회원 */
        openInteractiveModal({
          content: Message.Info.SuccessResponse,
          callback: () => {
            setResponse(new SnapVoteResponse());
            navigate('/');
          },
          closeCallback: () => {
            setResponse(new SnapVoteResponse());
            navigate('/');
          },
        });
      } else {
        /* 회원 */
        setResponse(new SnapVoteResponse());
        navigate(-1);
      }
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response?.status === 401) {
        setResponse(new SnapVoteResponse());
        logoutToken();
        navigate('/');
      } else {
        openModal({
          info: {
            title: '안내',
            content:
              error.response?.data.errorCode.message ||
              '저장하는데 문제가 발생했습니다.',
          },
        });
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

      if (!responseData?.id) return;

      if (response.voteAnswer.length === 0) {
        openModal({
          info: {
            title: '안내',
            content: responseData.isMultiple
              ? '다중 선택 가능한 투표입니다. 최소 1개 이상 선택해주세요.'
              : '선택지를 하나 선택해주세요.',
          },
        });
        return;
      }

      openInteractiveModal({
        content: '작성을 완료하시겠습니까?',
        callback: () => {
          const copyResponse = SnapVoteResponse.copy(response);
          copyResponse.userId = user?.id;
          copyResponse.voteId = responseData?.id;
          saveResponseMutate.mutate(copyResponse);
        },
      });

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [responseData?.id, response, user],
  );

  const isExpired = useMemo(() => {
    return validateExpired(responseData?.expiresAt);
  }, [responseData]);

  return (
    <Stack component="form" gap={3} onSubmit={handleSavePollResult}>
      {responseData && (
        <VoteLayout
          vote={responseData}
          expired={isExpired}
          refetchVote={refetchVote}
        />
      )}
      <Divider />
      <Button
        disabled={alreadyResponded || isExpired}
        variant="contained"
        size="large"
        type="submit"
      >
        {isExpired
          ? '마감된 설문입니다.'
          : alreadyResponded
            ? '이미 응답한 투표입니다.'
            : '제출'}
      </Button>
      {isShare && (
        <Button
          variant="contained"
          size="large"
          type="button"
          color="inherit"
          onClick={() => {
            navigate('/');
          }}
        >
          사이트로 이동
        </Button>
      )}
    </Stack>
  );
};

export default DetailVotePage;
