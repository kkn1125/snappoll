import { addLike } from '@apis/board/addLike';
import { removeLike } from '@apis/board/removeLike';
import useToken from '@hooks/useToken';
import { Button, Stack } from '@mui/material';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from '@tanstack/react-query';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { SnapBoard } from '@models/SnapBoard';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { AxiosError } from 'axios';
import { isNil } from '@utils/isNil';
import { useCallback, useMemo, useState } from 'react';

interface LikeButtonProps {
  board?: SnapBoard;
  refetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<SnapResponseType<SnapBoard>, Error>>;
}
const LikeButton: React.FC<LikeButtonProps> = ({ board, refetch }) => {
  const { openModal } = useModal();
  const { user } = useToken();
  const [pressLike, setPressLike] = useState(false);

  const addLikeMutation = useMutation({
    mutationKey: ['addLike'],
    mutationFn: addLike,
    onSuccess(data, variables, context) {
      setPressLike(false);
      refetch?.();
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      openModal({
        info: {
          title: '안내',
          content:
            error.response?.data?.errorCode?.message || '문제가 발생했습니다.',
        },
      });
      setPressLike(false);
      refetch?.();
    },
  });
  const removeLikeMutation = useMutation({
    mutationKey: ['removeLike'],
    mutationFn: removeLike,
    onSuccess(data, variables, context) {
      setPressLike(false);
      refetch?.();
    },
  });

  const handleAddLike = useCallback(() => {
    if (!board) return;
    addLikeMutation.mutate(board.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const handleRemoveLike = useCallback(() => {
    if (!board) return;
    removeLikeMutation.mutate(board.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const handleRequireLogin = useCallback(() => {
    openModal({
      info: Message.Require.Login,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handler = useMemo(() => {
    if (!board) {
      return () => {};
    }
    if (!user || isNil(board.liked)) {
      return handleRequireLogin;
    }

    if (board.liked === true) {
      return handleRemoveLike;
    } else if (board.liked === false) {
      return handleAddLike;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, user]);

  if (!board || isNil(board.liked)) return <></>;

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{
        fontSize: '0.8em',
      }}
    >
      <Button
        disabled={pressLike}
        onClick={() => {
          setPressLike(true);
          handler?.();
        }}
        variant={board.liked ? 'contained' : 'outlined'}
        sx={{
          ['&,&:disabled']: {
            cursor: 'pointer !important',
          },
          minWidth: 'auto',
          p: 0,
          width: 25,
          height: 25,
          borderRadius: '50%',
        }}
      >
        <ThumbUpIcon fontSize="small" sx={{ fontSize: 'inherit' }} />
      </Button>
      좋아요
    </Stack>
  );
};

export default LikeButton;
