import { addComment } from '@apis/comment/addComment';
import { editComment } from '@apis/comment/editComment';
import CustomInput from '@components/atoms/CustomInput';
import ProfileAvatar from '@components/atoms/ProfileAvatar';
import useToken from '@hooks/useToken';
import useValidate from '@hooks/useValidate';
import {
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getUsernameOrGuest } from '@utils/getUsernameOrGuest';
import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

interface CommentWriteProps {
  commentData?: SnapComment;
  group?: number;
  layer?: number;
  initializeComments: () => void;
  callbackAddComment?: () => void;
  // comment: SnapCommentAddDto;
  // errors: ErrorMessage<SnapComment>;
  // handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // handleSwitchChange: (e: SyntheticEvent, checked: boolean) => void;
  // handleSubmit: (e: FormEvent) => false | undefined;
}
const CommentWrite: React.FC<CommentWriteProps> = ({
  commentData,
  group,
  layer,
  initializeComments,
  callbackAddComment,
}) => {
  const { id: boardId } = useParams();
  const { user } = useToken();
  const locate = useLocation();
  /* write comment */
  const [comment, setComment] = useState<SnapCommentAddDto>({
    boardId: '',
    content: '',
    isAuthorOnly: false,
    group: group ?? 0,
    layer: layer ?? 0,
    userId: '',
  });
  const isEditMode = !!commentData;
  const { validate, validated, setValidated, errors, clearValidate } =
    useValidate(comment);

  const addCommentMutation = useMutation({
    mutationKey: ['addComment'],
    mutationFn: addComment,
    onSuccess(data, variables, context) {
      initializeComments();
      clearValidate();
      setValidated(false);
      callbackAddComment?.();
      setComment({
        boardId: boardId || '',
        content: '',
        isAuthorOnly: false,
        group: group ?? 0,
        layer: layer ?? 0,
        userId: user?.id || '',
      });
    },
  });

  const editCommentMutation = useMutation({
    mutationKey: ['editComment'],
    mutationFn: editComment,
    onSuccess(data, variables, context) {
      initializeComments();
      clearValidate();
      setValidated(false);
      callbackAddComment?.();
      setComment({
        boardId: boardId || '',
        content: '',
        isAuthorOnly: false,
        group: group ?? 0,
        layer: layer ?? 0,
        userId: user?.id || '',
      });
    },
  });

  useEffect(() => {
    if (commentData) {
      const { boardId, content, isAuthorOnly, userId, group, layer } =
        commentData;
      setComment({ boardId, content, isAuthorOnly, userId, group, layer });
    }
  }, [commentData]);

  useEffect(() => {
    if (user) {
      setComment((data) => ({ ...data, userId: user.id }));
    }
    if (boardId) {
      setComment((data) => ({ ...data, boardId: boardId }));
    }
  }, [boardId, user]);

  useEffect(() => {
    if (validated) {
      validate('comment');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, comment]);

  function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);

    if (!validate('comment')) return;

    // console.log('data:', comment);

    if (isEditMode) {
      editCommentMutation.mutate({ id: commentData.id, data: comment });
    } else {
      addCommentMutation.mutate(comment);
    }

    return false;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setComment((data) => ({ ...data, [name]: value }));
  }

  function handleSwitchChange(e: SyntheticEvent, checked: boolean) {
    const name = (e.target as HTMLInputElement).name;
    const value = checked;
    setComment((data) => ({ ...data, [name]: value }));
  }

  if (!user)
    return (
      <Paper>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <Typography>로그인이 필요합니다.</Typography>
          <Button
            component={Link}
            to="/auth/login"
            state={{ from: locate.pathname }}
          >
            로그인하기
          </Button>
        </Stack>
      </Paper>
    );

  return (
    <Paper>
      <Stack component="form" p={3} noValidate onSubmit={handleCommentSubmit}>
        <Stack direction="row" alignItems="center" gap={1}>
          <ProfileAvatar
            size={35}
            username={getUsernameOrGuest(user.username)}
            profileImage={user?.userProfile?.id}
          />
          <Stack>
            <Typography fontSize={12} fontWeight={500} color="textDisabled">
              작성자
            </Typography>
            <Typography fontSize={14} color="textSecondary">
              {getUsernameOrGuest(user?.username)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={1} alignItems="stretch" mt={2}>
          <CustomInput
            name="content"
            value={comment['content'] || ''}
            onChange={handleChange}
            errors={errors}
            multiline
            rows={2}
            size="small"
            variant="filled"
            fullWidth
          />
          <Button type="submit" variant="contained">
            {isEditMode ? '수정' : '작성'}
          </Button>
        </Stack>
        <FormControlLabel
          name="isAuthorOnly"
          label="게시자에게만 보이기"
          checked={comment['isAuthorOnly'] || false}
          onChange={handleSwitchChange}
          control={<Switch />}
        />
      </Stack>
    </Paper>
  );
};

export default CommentWrite;
