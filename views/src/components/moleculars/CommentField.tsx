import { Paper, Stack, Typography, Button, Chip } from '@mui/material';
import CommentWrite from './CommentWrite';
import { useMemo, useState } from 'react';
import ReplyIcon from '@mui/icons-material/Reply';
import { getUsernameOrGuest } from '@utils/getUsernameOrGuest';
import useToken from '@hooks/useToken';
import ProfileAvatar from '@components/atoms/ProfileAvatar';
import { UnknownName } from '@common/variables';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useMutation } from '@tanstack/react-query';
import { removeComment } from '@apis/comment/removeComment';
import useModal from '@hooks/useModal';
import { Message } from '@common/messages';
import { revokeComment } from '@apis/comment/revokeComment';
import LockIcon from '@mui/icons-material/Lock';

interface CommentFieldProps {
  comment: SnapComment;
  comments?: SnapComment[];
  initializeComments: () => void;
}
const CommentField: React.FC<CommentFieldProps> = ({
  comment,
  comments,
  initializeComments,
}) => {
  const { openInteractiveModal } = useModal();
  const { user } = useToken();
  const [showField, setShowField] = useState(false);
  const [showEditField, setShowEditField] = useState(false);

  const revokeCommentMutation = useMutation({
    mutationKey: ['revokeComment'],
    mutationFn: revokeComment,
    onSuccess(data, variables, context) {
      initializeComments();
    },
  });

  const removeCommentMutation = useMutation({
    mutationKey: ['removeComment'],
    mutationFn: removeComment,
    onSuccess(data, variables, context) {
      initializeComments();
    },
  });

  const parentComment = useMemo(() => {
    return comments?.find(
      (cmt) => cmt.group === comment.group && cmt.layer === 0,
    );
  }, [comments, comment]);

  const childComment = useMemo(() => {
    return comments?.find(
      (cmt) =>
        cmt.group === comment.group &&
        // cmt.userId === comment.userId &&
        cmt.userId === user?.id &&
        cmt.isAuthorOnly &&
        cmt.order <= comment.order,
    );
  }, [comment, comments, user]);

  function handleOpenField() {
    setShowField((showField) => !showField);
  }

  function handleOpenEditField() {
    setShowEditField((showEditField) => !showEditField);
  }

  function callbackAddComment() {
    setShowField(false);
    setShowEditField(false);
  }

  function handleRevokeComment(id: number) {
    openInteractiveModal({
      content: Message.Single.Revoke,
      callback: () => {
        revokeCommentMutation.mutate(id);
      },
    });
  }

  function handleRemoveComment(id: number) {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback: () => {
        removeCommentMutation.mutate(id);
      },
    });
  }

  const isBoardAuthor = comment.userId === comment.board.userId;
  const isFirstMe = parentComment?.userId === user?.id;
  const isMine = user?.id === comment.userId;
  const isVisible =
    user?.id === comment.board.userId || isFirstMe || childComment;
  const isDeleted = comment.deletedAt !== null;
  const isPrivate = comment.isAuthorOnly;
  const isNotMineAuthorOnly = comment.isAuthorOnly && !isMine && !isVisible;

  // const caseComment = useMemo(() => {
  //   // 1. 내가 댓글을 단 경우
  //   // 2. 내가 댓글을 단 경우
  //   // 3. 비공개 댓글을 단 경우
  //   // 4. 비공개 댓글에 게시자가 댓글을 단 경우
  //   // 5. 공개 댓글에 비공개 댓글을 단 경우
  //   // ## 비공개는 게시자에게만 공개
  //   // ## 비공개로 시작한 사람에게는 하위에 달리는 게시자의 비공개 댓글은 공개처리

  //   if (isPrivate) {
  //     if (!isMine && !isAuthor) {
  //       // 제 3자가 보는 댓글
  //       // 삭제됨 or 비밀 댓글
  //     }
  //   } else {
  //     //
  //   }
  // }, []);

  return (
    <Paper
      variant={isMine ? 'outlined' : 'elevation'}
      sx={{
        ml: comment.layer * 3,
        ...(isMine && {
          borderColor: (theme) => theme.palette.info.main,
        }),
      }}
    >
      {isNotMineAuthorOnly ? (
        <Stack p={3}>
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              <Stack direction="row" alignItems="center" gap={1} mb={2}>
                <ProfileAvatar
                  size={35}
                  username={getUsernameOrGuest(
                    comment?.user?.username +
                      (isBoardAuthor ? ' (게시자)' : ''),
                  )}
                  profileImage={comment?.user?.userProfile?.id}
                />
                <Stack>
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color="textDisabled"
                  >
                    작성자
                  </Typography>
                  <Typography fontSize={14} color="textSecondary">
                    {getUsernameOrGuest(
                      comment?.user?.username +
                        (isBoardAuthor ? ' (게시자)' : ''),
                    )}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Chip
                  icon={<LockIcon />}
                  color="default"
                  size="small"
                  label="비밀 댓글"
                />
              </Stack>
            </Stack>
            {isDeleted && !isMine ? (
              <Typography my={1}>삭제된 댓글입니다.</Typography>
            ) : (
              <Typography my={1} color="textDisabled">
                게시자와 댓글 작성자만 볼 수 있습니다.
              </Typography>
            )}
          </Stack>
        </Stack>
      ) : (
        <Stack p={3}>
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <ProfileAvatar
                  size={35}
                  username={getUsernameOrGuest(
                    comment?.user?.username +
                      (isBoardAuthor ? ' (게시자)' : ''),
                  )}
                  profileImage={comment?.user?.userProfile?.id}
                />
                <Stack>
                  <Typography
                    fontSize={12}
                    fontWeight={500}
                    color="textDisabled"
                  >
                    작성자
                  </Typography>
                  <Typography fontSize={14} color="textSecondary">
                    {getUsernameOrGuest(
                      comment?.user?.username +
                        (isBoardAuthor ? ' (게시자)' : ''),
                    )}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                {comment.isAuthorOnly && (
                  <Chip size="small" label="비밀 댓글" icon={<LockIcon />} />
                )}
                {isDeleted && isMine && (
                  <Chip
                    color="error"
                    size="small"
                    label="삭제처리 된 댓글입니다."
                  />
                )}
              </Stack>
            </Stack>
            {isDeleted && !isMine ? (
              <Typography my={1}>삭제된 댓글입니다.</Typography>
            ) : (
              <Typography my={1}>{comment.content}</Typography>
            )}
          </Stack>
          <Stack direction="row" justifyContent="flex-end" gap={1}>
            {isMine && (
              <Button
                color="inherit"
                startIcon={<BackspaceIcon />}
                onClick={() =>
                  isDeleted
                    ? handleRevokeComment(comment.id)
                    : handleRemoveComment(comment.id)
                }
              >
                {isDeleted ? '복구' : '삭제'}
              </Button>
            )}
            {!isDeleted && isMine && (
              <Button
                color="inherit"
                startIcon={<EditIcon />}
                onClick={handleOpenEditField}
              >
                {showEditField ? '취소' : '수정'}
              </Button>
            )}
            {!isDeleted && (
              <Button
                startIcon={<ReplyIcon />}
                variant="outlined"
                onClick={handleOpenField}
              >
                {showField ? '취소' : '답글'}
              </Button>
            )}
          </Stack>
          {showField && (
            <CommentWrite
              group={comment.id}
              initializeComments={initializeComments}
              callbackAddComment={callbackAddComment}
            />
          )}
          {showEditField && (
            <CommentWrite
              commentData={comment}
              group={comment.id}
              initializeComments={initializeComments}
              callbackAddComment={callbackAddComment}
            />
          )}
        </Stack>
      )}
    </Paper>
  );
};

export default CommentField;
