import { createPoll } from '@/apis/poll/create.poll';
import { Action } from '@/models/Action';
import { previousAtom } from '@/recoils/previous.atom';
import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { Message } from '@common/messages';
import CreatePollForm from '@components/moleculars/CreatePollForm';
import CreateQuestionForm from '@components/moleculars/CreateQuestionForm';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Container,
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Toolbar,
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

interface CreateSnapPollProps {}
const CreateSnapPoll: React.FC<CreateSnapPollProps> = () => {
  const { user, logoutToken } = useToken();
  const previous = useRecoilValue(previousAtom);
  const { openInteractiveModal } = useModal();
  // const [{ user }, setToken] = useRecoilState(tokenAtom);
  const navigate = useNavigate();
  const [snapPoll, setSnapPoll] = useRecoilState(snapPollAtom);
  const [validated, setValidated] = useState(false);
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
  const actions = [
    new Action('Add Question', <AddBoxIcon />, () => {
      addQuestion();
    }),
    new Action('Save', <SaveIcon />, () => {
      formRef.current?.requestSubmit();
    }),
  ];
  const [errors, setErrors] = useState<ErrorMessage<SnapPoll>>({});

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

  const validateForm = useCallback((snapPoll: SnapPoll) => {
    const copyErrors: ErrorMessage<SnapPoll> = {};
    if (snapPoll.title === '') {
      copyErrors['title'] = '필수입니다.';
    }
    if (snapPoll.description === '') {
      copyErrors['description'] = '필수입니다.';
    }
    if (snapPoll.expiresAt && snapPoll.expiresAt < new Date()) {
      copyErrors['expiresAt'] = '현재보다 과거일 수 없습니다.';
    }

    setErrors(copyErrors);

    return Object.keys(copyErrors).length === 0;
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validateForm(snapPoll)) return;

      const copyPoll = SnapPoll.copy(snapPoll);

      if (user) {
        copyPoll.createdBy = user.id;
      }

      openInteractiveModal(Message.Single.Save, () => {
        createMutate.mutate(copyPoll);
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
