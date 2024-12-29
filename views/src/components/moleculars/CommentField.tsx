import { Paper, Stack, Typography, Button, Chip } from '@mui/material';
import CommentWrite from './CommentWrite';
import { useState } from 'react';
import ReplyIcon from '@mui/icons-material/Reply';
import { getUsernameOrGuest } from '@utils/getUsernameOrGuest';
import useToken from '@hooks/useToken';
import ProfileAvatar from '@components/atoms/ProfileAvatar';
import { UnknownName } from '@common/variables';

interface CommentFieldProps {
  comment: SnapComment;
  initializeComments: () => void;
}
const CommentField: React.FC<CommentFieldProps> = ({
  comment,
  initializeComments,
}) => {
  const { user } = useToken();
  const [showField, setShowField] = useState(false);

  const isMine = user?.id === comment.userId;

  function handleOpenField() {
    setShowField((showField) => !showField);
  }

  function callbackAddComment() {
    setShowField(false);
  }

  return (
    <Paper sx={{ ml: comment.layer * 3 }}>
      {comment.isAuthorOnly && !isMine ? (
        <Stack p={3}>
          <Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <ProfileAvatar
                size={35}
                username={getUsernameOrGuest(comment.user.username)}
                profileImage={comment?.user?.userProfile?.id}
              />
              <Stack>
                <Typography fontSize={12} fontWeight={500} color="textDisabled">
                  작성자
                </Typography>
                <Typography fontSize={14} color="textSecondary">
                  {getUsernameOrGuest(comment?.user?.username)}
                </Typography>
              </Stack>
            </Stack>
            <Typography>게시자만 볼 수 있는 글 입니다.</Typography>
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
                  username={getUsernameOrGuest(comment.user.username)}
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
                    {getUsernameOrGuest(comment?.user?.username)}
                  </Typography>
                </Stack>
              </Stack>
              {comment.isAuthorOnly && (
                <Chip size="small" label="게시자만 볼 수 있는 글입니다." />
              )}
            </Stack>
            <Typography my={1}>{comment.content}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              startIcon={<ReplyIcon />}
              variant="outlined"
              onClick={handleOpenField}
            >
              {showField ? '취소' : '답글'}
            </Button>
          </Stack>
          {showField && (
            <CommentWrite
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
