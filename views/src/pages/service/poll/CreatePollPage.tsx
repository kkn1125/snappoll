import { Action } from '@/models/Action';
import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { createPoll } from '@apis/poll/create.poll';
import { updatePoll } from '@apis/poll/updatePoll';
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
  Button,
  Container,
  Divider,
  FormHelperText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Toolbar,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormEvent, memo, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface CreatePollPageProps {
  edit?: boolean;
}
const CreatePollPage: React.FC<CreatePollPageProps> = ({ edit = false }) => {
  const { user, logoutToken } = useToken();
  const { openModal, openInteractiveModal } = useModal();
  const navigate = useNavigate();
  const [snapPoll, setSnapPoll] = useRecoilState(snapPollAtom);
  const { validate, errors, validated, setValidated, clearValidate } =
    useValidate(snapPoll);
  const formRef = useRef<HTMLFormElement>(null);
  const createMutate = useMutation({
    mutationKey: ['createPoll'],
    mutationFn: createPoll,
    onSuccess(data, variables, context) {
      clearValidate();
      setSnapPoll(new SnapPoll());
      navigate('/service/poll');
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response?.status === 401) {
        setSnapPoll(new SnapPoll());
        logoutToken();
        navigate('/');
      } else {
        if (error.response?.data.errorCode.errorStatus === 108) {
          openInteractiveModal({
            content: {
              title: '안내',
              content: [
                error.response?.data.errorCode.message,
                '플랜 업그레이드를 원하시면 확인을 눌러주세요.',
              ],
            },
            callback: () => {
              navigate('/price');
            },
          });
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
      }
    },
  });
  const updateMutate = useMutation({
    mutationKey: ['updatePoll'],
    mutationFn: updatePoll,
    onSuccess(data, variables, context) {
      setSnapPoll(new SnapPoll());
      navigate('/service/poll');
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
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
    if (validated) {
      validate('snapPoll', edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapPoll, validated]);

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
    if (edit) {
      newQuestion.pollId = snapPoll.id;
    }
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.addQuestion(newQuestion);
      return copyPoll;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validate('snapPoll', edit)) return;
      const copyPoll = SnapPoll.copy(snapPoll);

      if (user) {
        copyPoll.userId = user.id;
      }

      openInteractiveModal({
        content: Message.Single.Save,
        callback: () => {
          if (edit) {
            updateMutate.mutate(copyPoll);
          } else {
            createMutate.mutate(copyPoll);
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snapPoll, user],
  );

  return (
    <Stack
      component="form"
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      gap={2}
    >
      <CreatePollForm errors={errors} />

      <Divider />

      {typeof errors?.question === 'string' && errors?.question && (
        <FormHelperText error>{errors.question}</FormHelperText>
      )}
      <Stack gap={3}>
        {snapPoll.question
          .toSorted((a, b) => a.order - b.order)
          .map((question, i) => (
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
  );
};

export default memo(CreatePollPage);
