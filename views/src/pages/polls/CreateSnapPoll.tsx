import { createPoll } from '@/apis/poll/create.poll';
import { updatePoll } from '@/apis/poll/updatePoll';
import { Action } from '@/models/Action';
import { previousAtom } from '@/recoils/previous.atom';
import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { Message } from '@common/messages';
import CreatePollForm from '@components/moleculars/CreatePollForm';
import CreateQuestionForm from '@components/moleculars/CreateQuestionForm';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import useValidate from '@hooks/useValidate';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  SvgIcon,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

interface CreateSnapPollProps {
  edit?: boolean;
}
const CreateSnapPoll: React.FC<CreateSnapPollProps> = ({ edit = false }) => {
  const { user, logoutToken } = useToken();
  const previous = useRecoilValue(previousAtom);
  const { openInteractiveModal } = useModal();
  const navigate = useNavigate();
  const [snapPoll, setSnapPoll] = useRecoilState(snapPollAtom);
  const { validate, errors, validated, setValidated } = useValidate(snapPoll);
  const formRef = useRef<HTMLFormElement>(null);
  const createMutate = useMutation({
    mutationKey: ['createPoll'],
    mutationFn: createPoll,
    onSuccess(data, variables, context) {
      setSnapPoll(new SnapPoll());
      navigate(previous || '/');
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setSnapPoll(new SnapPoll());
        logoutToken();
        navigate('/');
      }
    },
  });
  const updateMutate = useMutation({
    mutationKey: ['updatePoll'],
    mutationFn: updatePoll,
    onSuccess(data, variables, context) {
      setSnapPoll(new SnapPoll());
      navigate(previous || '/');
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setSnapPoll(new SnapPoll());
        logoutToken();
        navigate('/');
      }
    },
  });

  const actions = [
    new Action('Save', <SaveIcon />, () => {
      formRef.current?.requestSubmit();
    }),
  ];

  useEffect(() => {
    function handleBeforeUnloaded(e: BeforeUnloadEvent) {
      e.preventDefault();
      return '';
    }
    window.addEventListener('beforeunload', handleBeforeUnloaded, {
      capture: true,
    });
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloaded, {
        capture: true,
      });
    };
  }, []);

  const addQuestion = useCallback(() => {
    const newQuestion = new SnapPollQuestion();
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.addQuestion(newQuestion);
      return copyPoll;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validate('snapPoll')) return;

      const copyPoll = SnapPoll.copy(snapPoll);

      if (user) {
        copyPoll.createdBy = user.id;
      }

      openInteractiveModal(Message.Single.Save, () => {
        if (edit) {
          updateMutate.mutate(copyPoll);
        } else {
          createMutate.mutate(copyPoll);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snapPoll, user],
  );

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack
        component="form"
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        gap={2}
      >
        <Stack direction="row">
          <Button
            component={Link}
            to={previous || '/'}
            reloadDocument
            variant="contained"
            color="inherit"
          >
            이전으로
          </Button>
        </Stack>

        <CreatePollForm errors={errors} />

        <Divider />

        <Stack gap={3}>
          {snapPoll.question.map((question, i) => (
            <CreateQuestionForm
              key={question.id}
              index={i + 1}
              question={question}
              errors={
                errors.question?.[
                  i
                ] as unknown as ErrorMessage<SnapPollQuestion>
              }
            />
          ))}
          <Button
            size="large"
            fullWidth
            variant="outlined"
            onClick={addQuestion}
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px !important',
              ['& svg']: {
                fontSize: '24px !important',
              },
              gap: 1,
            }}
          >
            <AddBoxIcon />
            질문 추가
          </Button>
        </Stack>
        <Toolbar />
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Stack>
    </Container>
  );
};

export default memo(CreateSnapPoll);
