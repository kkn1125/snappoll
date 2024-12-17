import { deleteBoard } from '@/apis/board/deleteBoard';
import { getBoardCategoryOne } from '@/apis/board/getBoardCategoryOne';
import { validateBoardPassword } from '@/apis/board/validateBoardPassword';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import useValidate from '@hooks/useValidate';
import { SnapBoard } from '@models/SnapBoard';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsernameOrGuest } from '@utils/getUsernameOrGuest';
import { AxiosError } from 'axios';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface DetailBoardPageProps {}
const DetailBoardPage: React.FC<DetailBoardPageProps> = () => {
  const { user } = useToken();
  const navigate = useNavigate();
  const { openModal, openInteractiveModal } = useModal();
  const { category, id } = useParams();
  const { data } = useQuery<SnapResponseType<SnapBoard>>({
    queryKey: ['board', id, category],
    queryFn: () => getBoardCategoryOne(category, id),
  });
  const [showModal, setShowModal] = useState('');
  const board = data?.data;
  const isGuestBoard = !board?.userId;
  const [info, setInfo] = useState({ password: '' });
  const { errors, validate, validated, setValidated, clearValidate } =
    useValidate(info);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateMutation = useMutation({
    mutationKey: ['validate'],
    mutationFn: validateBoardPassword,
    onSuccess(data, variables, context) {
      if (data.data) {
        if (showModal === 'edit') {
          //
          navigate(`/board/${category}/edit`, { state: { board } });
        } else if (showModal === 'delete') {
          deleteMutation.mutate({ id, password: info.password });
        }
      } else {
        openModal({
          info: { title: '안내', content: '비밀번호를 다시 확인해주세요.' },
          closeCallback: () => {
            passwordRef.current?.focus();
          },
        });
      }
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      openModal({
        info: {
          title: '안내',
          content:
            error.response?.data.errorCode.message || '잘못된 요청입니다.',
        },
        closeCallback: () => {
          passwordRef.current?.focus();
        },
      });
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteBoard'],
    mutationFn: deleteBoard,
    onSuccess(data, variables, context) {
      openInteractiveModal({
        content: Message.Info.SuccessDelete,
        callback: () => {
          navigate('/board/community');
        },
        closeCallback: () => {
          navigate('/board/community');
        },
      });
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      openModal({
        info: {
          title: '안내',
          content:
            error.response?.data?.errorCode.message || '삭제에 실패했습니다.',
        },
      });
    },
  });

  const handleClearModal = useCallback(function () {
    setInfo({ password: '' });
    setShowModal('');
    setValidated(false);
    clearValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    function handleClose(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target?.closest('#sub-modal,#modal-window')) {
        handleClearModal();
        passwordRef.current?.focus();
      }
    }
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
      setInfo({ password: '' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (validated) {
      validate('boardPassword');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, validated]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);
    if (!validate('boardPassword')) return;

    validateMutation.mutate({ password: info.password, id });

    return false;
  }

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    setInfo({ password: e.target.value });
  }

  function handleOpenEditModal(e: React.MouseEvent) {
    e.stopPropagation();
    if (user && user.id === board?.userId) {
      navigate(`/board/${category}/edit`, { state: { board } });
    } else {
      setShowModal('edit');
    }
  }
  function handleOpenRemoveModal(e: React.MouseEvent) {
    e.stopPropagation();
    if (user && user.id === board?.userId) {
      openInteractiveModal({
        content: Message.Single.Remove,
        callback: () => {
          deleteMutation.mutate({ id, password: info.password });
        },
      });
    } else {
      setShowModal('delete');
    }
  }

  return (
    <Container maxWidth="md">
      {!!showModal && (
        <Paper
          id="sub-modal"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
          }}
        >
          <Stack component="form" p={3} onSubmit={handleSubmit}>
            <Stack>
              <Typography>비밀번호 확인</Typography>
              <Typography variant="caption" gutterBottom>
                게시물 작성 당시 비밀번호를 적어주세요.
              </Typography>
              <CustomInput
                name="password"
                type="password"
                value={info['password']}
                size="small"
                variant="standard"
                autoFocus
                autoComplete="new-password"
                fullWidth
                onChange={handleChangePassword}
                errors={errors}
                refValue={passwordRef}
              />
            </Stack>
            <Stack gap={1} mt={2}>
              <Button variant="outlined" type="submit">
                확인
              </Button>
              <Button
                variant="outlined"
                color="error"
                type="button"
                onClick={handleClearModal}
              >
                닫기
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
      {category === 'community' &&
        (isGuestBoard || board?.userId === user?.id) && (
          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenEditModal}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenRemoveModal}
            >
              삭제
            </Button>
          </Stack>
        )}
      <Stack gap={2}>
        <Typography variant="h4">{board?.title}</Typography>
        <Typography align="right" color="textDisabled">
          작성자: {getUsernameOrGuest(board?.author?.username)}
        </Typography>
        <Divider flexItem />
        <Box>
          <Typography
            fontWeight={500}
            dangerouslySetInnerHTML={{ __html: board?.content || '' }}
          ></Typography>
        </Box>
        <Divider flexItem />
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => history.go(-1)}
          >
            이전으로
          </Button>
          <Button
            component={Link}
            variant="outlined"
            color="inherit"
            to={`/board/${category}`}
          >
            목록으로
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailBoardPage;
