import { createVote } from '@/apis/vote/create.vote';
import { Action } from '@/models/Action';
import { previousAtom } from '@/recoils/previous.atom';
import { snapVoteAtom } from '@/recoils/snapVote.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import CreateVoteOptionItem from '@components/atoms/CreateVoteOptionItem';
import CreateVoteForm from '@components/moleculars/CreateVoteForm';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
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
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

interface CreateSnapVoteProps {}
const CreateSnapVote: React.FC<CreateSnapVoteProps> = () => {
  const previous = useRecoilValue(previousAtom);
  const [snapVote, setSnapVote] = useRecoilState(snapVoteAtom);
  const { openModal, openInteractiveModal } = useModal();
  const [{ user }, setToken] = useRecoilState(tokenAtom);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const createMutate = useMutation({
    mutationKey: ['createVote'],
    mutationFn: createVote,
    onSuccess(data, variables, context) {
      setSnapVote(new SnapVote());
      navigate(previous || '/');
    },
    onError(error: AxiosError, variables, context) {
      if (error.response?.status === 401) {
        setSnapVote(new SnapVote());
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

  const addOption = useCallback(() => {
    const newOption = new SnapVoteOption();
    setSnapVote((snapVote) => {
      const copyVote = SnapVote.copy(snapVote);
      copyVote.addOption(newOption);
      return copyVote;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = [
    new Action('Add Option', <AddBoxIcon />, () => {
      addOption();
    }),
    new Action('Save', <SaveIcon />, () => {
      formRef.current?.requestSubmit();
    }),
  ];

  const [errors, setErrors] = useState<ErrorMessage<SnapVote>>({});

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

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    openInteractiveModal(Message.Single.Save, () => {
      const copyVote = SnapVote.copy(snapVote);
      if (user) {
        copyVote.userId = user.id;
        createMutate.mutate(copyVote);
      }
    });
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack component="form" ref={formRef} onSubmit={handleSubmit} gap={2}>
        <Stack direction="row">
          <Button
            component={Link}
            to={previous || '/'}
            color="inherit"
            variant="contained"
            reloadDocument
          >
            이전으로
          </Button>
        </Stack>

        <CreateVoteForm errors={errors} />

        <Divider />

        <Stack gap={3}>
          {snapVote.voteOption.map((option, i) => (
            <CreateVoteOptionItem
              key={option.id}
              index={i + 1}
              option={option}
              errors={
                errors.voteOption?.[
                  i
                ] as unknown as ErrorMessage<SnapVoteOption>
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

export default CreateSnapVote;
