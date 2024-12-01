import { createPoll } from '@/apis/poll/create.poll';
import { Action } from '@/models/Action';
import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { tokenAtom } from '@/recoils/token.atom';
import CreatePollForm from '@components/moleculars/CreatePollForm';
import CreateQuestionForm from '@components/moleculars/CreateQuestionForm';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollOption } from '@models/SnapPollOption';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import {
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
import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface CreateSnapPollProps {}
const CreateSnapPoll: React.FC<CreateSnapPollProps> = () => {
  const [{ user }, setToken] = useRecoilState(tokenAtom);
  const navigate = useNavigate();
  const [snapPoll, setSnapPoll] = useRecoilState(snapPollAtom);
  const formRef = useRef<HTMLFormElement>(null);
  const createMutate = useMutation({
    mutationKey: ['createPoll'],
    mutationFn: createPoll,
    onSuccess(data, variables, context) {
      setSnapPoll(new SnapPoll());
      navigate(-1);
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setSnapPoll(new SnapPoll());
        localStorage.setItem('logged_in', 'false');
        setToken({
          signed: false,
          user: undefined,
          token: undefined,
          expired: true,
        });
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
  const [errors, setErrors] = useState<{
    poll: ErrorMessage<SnapPoll>;
    question: ErrorMessage<SnapPollQuestion>;
    option: ErrorMessage<SnapPollOption>;
  }>({
    poll: {},
    question: {},
    option: {},
  });

  const addQuestion = useCallback(() => {
    const newQuestion = new SnapPollQuestion();
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.addQuestion(newQuestion);
      return copyPoll;
    });
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const copyPoll = SnapPoll.copy(snapPoll);
    if (user) {
      copyPoll.createdBy = user.id;
    }
    // snapPoll.createdBy
    createMutate.mutate(copyPoll);
  }

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack component="form" ref={formRef} onSubmit={handleSubmit} gap={2}>
        <CreatePollForm errors={errors.poll} />
        <Divider />

        <Stack gap={3}>
          {snapPoll.question.map((question, i) => (
            <CreateQuestionForm
              key={question.id}
              index={i + 1}
              question={question}
              errors={errors.question}
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
