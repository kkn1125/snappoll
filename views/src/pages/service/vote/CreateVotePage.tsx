import { Action } from '@/models/Action';
import { snapVoteAtom } from '@/recoils/snapVote.atom';
import { createVote } from '@apis/vote/create.vote';
import { updateVote } from '@apis/vote/updateVote';
import { Message } from '@common/messages';
import CreateVoteOptionItem from '@components/atoms/CreateVoteOptionItem';
import CreateVoteForm from '@components/moleculars/CreateVoteForm';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import useValidate from '@hooks/useValidate';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Container,
  Divider,
  FormHelperText,
  List,
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

interface CreateVotePageProps {
  edit?: boolean;
}
const CreateVotePage: React.FC<CreateVotePageProps> = ({ edit = false }) => {
  const [snapVote, setSnapVote] = useRecoilState(snapVoteAtom);
  const { openModal, openInteractiveModal } = useModal();
  const { errors, validate, validated, setValidated, clearValidate } =
    useValidate(snapVote);
  const { user, logoutToken } = useToken();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const createMutate = useMutation({
    mutationKey: ['createVote'],
    mutationFn: createVote,
    onSuccess(data, variables, context) {
      clearValidate();
      setSnapVote(new SnapVote());
      navigate('/service/vote');
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response?.status === 401) {
        setSnapVote(new SnapVote());
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
    mutationKey: ['updateVote'],
    mutationFn: updateVote,
    onSuccess(data, variables, context) {
      setSnapVote(new SnapVote());
      navigate('/service/vote');
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      if (error.response?.status === 401) {
        setSnapVote(new SnapVote());
        logoutToken();
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
    new Action('Save', <SaveIcon />, () => {
      formRef.current?.requestSubmit();
    }),
  ];

  // const [errors, setErrors] = useState<ErrorMessage<SnapVote>>({});

  useEffect(() => {
    if (validated) {
      validate('snapVote', edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapVote, validated]);

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

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validate('snapVote', edit)) return;

      openInteractiveModal({
        content: Message.Single.Save,
        callback: () => {
          const copyVote = SnapVote.copy(snapVote);
          if (user) {
            copyVote.userId = user.id;
            if (edit) {
              updateMutate.mutate(copyVote);
            } else {
              createMutate.mutate(copyVote);
            }
          }
        },
      });
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snapVote, user],
  );

  return (
    <Stack
      component="form"
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      gap={2}
    >
      <CreateVoteForm errors={errors} />

      <Divider />

      <List>
        {typeof errors?.voteOption === 'string' && errors?.voteOption && (
          <FormHelperText error>{errors.voteOption}</FormHelperText>
        )}
        {snapVote.voteOption
          .toSorted((a, b) => a.order - b.order)
          .map((option, i) => (
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
      </List>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        startIcon={<AddBoxIcon />}
        onClick={addOption}
      >
        항목 추가
      </Button>

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

export default memo(CreateVotePage);
