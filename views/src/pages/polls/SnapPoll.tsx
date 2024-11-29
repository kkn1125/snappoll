import { addPoll } from '@/apis/addPoll';
import { Action } from '@/models/Action';
import { Message } from '@common/messages';
import PollOptionItem from '@components/moleculars/PollOptionItem';
import useModal from '@hooks/useModal';
import useSnapPoll from '@hooks/useSnapPoll';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Container,
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  DateTimePicker,
  DateTimeValidationError,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers';
import { Poll } from '@utils/Poll';
import dayjs from 'dayjs';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// const actions = [
//   // { icon: <FileCopyIcon />, name: 'Copy' },
//   { icon: <SaveIcon />, name: 'Save' },
//   { icon: <PreviewIcon />, name: 'Preview' },
//   // { icon: <PrintIcon />, name: 'Print' },
//   // { icon: <ShareIcon />, name: 'Share' },
// ];
interface SnapPollProps {}
const SnapPoll: React.FC<SnapPollProps> = () => {
  const { openModal, openInteractiveModal } = useModal();
  const formRef = useRef<HTMLFormElement>(null);
  const locate = useLocation();
  const [errors, setErrors] = useState<
    Record<string, { itemIndex: number; cause: string }>
  >({});
  const navigate = useNavigate();
  const { setSnapPolls } = useSnapPoll();
  const [baseInfo, setBaseInfo] = useState<Record<string, string | Date>>({
    title: '',
    description: '',
    start: new Date(),
    expiresAt: new Date(),
  });
  const [polls, setPolls] = useState<Poll<PollType['type']>[]>([]);
  const actions = [
    new Action('Save', <SaveIcon />, () => {
      formRef.current?.requestSubmit();
    }),
    new Action('Preview', <PreviewIcon />, () =>
      navigate('/polls/new/preview', {
        state: {
          data: {
            ...baseInfo,
            options: JSON.stringify(polls),
          },
        },
      }),
    ),
  ];

  useEffect(() => {
    window.history.replaceState({}, '');

    const state = locate.state;
    if (state?.data) {
      const { data } = state;
      const { title, description, start, expiresAt, options } = data;
      setBaseInfo({
        title,
        description,
        start,
        expiresAt,
      });
      const optionList = JSON.parse(options);
      setPolls(optionList.map((option: any) => new Poll(option)));
    } else {
      setPolls((polls) => [...polls, new Poll<'text'>()]);
    }
  }, [locate.state]);

  function updateBaseInfo(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    if (target) {
      setBaseInfo((baseInfo) => ({ ...baseInfo, [name]: value }));
    }
  }

  function updateExpiresTime(name: string) {
    return (
      value: dayjs.Dayjs | null,
      _context: PickerChangeHandlerContext<DateTimeValidationError>,
    ) => {
      setBaseInfo((baseInfo) => ({
        ...baseInfo,
        [name]: value?.toDate() || new Date(),
      }));
    };
  }

  function handleAddPollOption() {
    setPolls([...polls, new Poll<'text'>()]);
  }

  function updatePoll(poll: Poll<PollType['type']>) {
    setPolls((polls) =>
      polls.map((item) => {
        if (item.id === poll.id) return poll;
        return item;
      }),
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    /* do something... */
    const { start, ...rest } = baseInfo;

    if (polls.length === 0) return;
    if (Object.keys(errors).length > 0) return;

    setSnapPolls(polls);
    addPoll({ ...rest, options: JSON.stringify(polls) });

    /* 초기화 */
    setBaseInfo({
      title: '',
      description: '',
      start: new Date(),
      expiresAt: new Date(),
    });
    setPolls([]);
    setErrors({});

    return false;
  }

  function handleDeletePoll(pollId: string) {
    openInteractiveModal(Message.Single.Remove, () => {
      if (polls.length > 1) {
        setPolls(polls.filter((poll) => poll.id !== pollId));
      } else {
        openModal(Message.Info.NoDeleteOne);
      }
    });
  }

  return (
    <Container component={Stack} p={5} gap={3}>
      <Stack
        ref={formRef}
        component="form"
        onSubmit={handleSubmit}
        gap={3}
        p={3}
        sx={{
          border: '1px solid #ccc',
          borderRadius: 5,
        }}
      >
        <Typography fontSize={28} fontWeight={700}>
          설문지 제작
        </Typography>
        {/* 기본 필드 */}
        <Stack gap={1}>
          <Typography fontSize={20} fontWeight={700}>
            설문 제목
          </Typography>
          <TextField
            autoFocus
            size="small"
            name="title"
            placeholder="제목을 입력해주세요."
            label="제목"
            value={baseInfo.title}
            onChange={updateBaseInfo}
          />
        </Stack>

        <Stack gap={1}>
          <Typography fontSize={20} fontWeight={700}>
            설문 개요
          </Typography>
          <TextField
            size="small"
            name="description"
            placeholder="자유롭게 입력해주세요."
            label="개요"
            value={baseInfo.description}
            onChange={updateBaseInfo}
          />
        </Stack>

        <Stack gap={1}>
          <Typography fontSize={20} fontWeight={700}>
            설문 기간
          </Typography>
          <Stack direction="row" gap={1} alignItems="center">
            <DateTimePicker
              format="YYYY. MM. DD. HH:mm"
              value={dayjs(baseInfo.start)}
              sx={{
                ['&, & .MuiInputBase-root']: {
                  maxHeight: 40,
                },
              }}
              onChange={updateExpiresTime('start')}
            />
            <Typography fontSize={24} fontWeight={700}>
              ~
            </Typography>
            <DateTimePicker
              format="YYYY. MM. DD. HH:mm"
              value={dayjs(baseInfo.expiresAt)}
              sx={{
                ['&, & .MuiInputBase-root']: {
                  maxHeight: 40,
                },
              }}
              onChange={updateExpiresTime('expiresAt')}
            />
          </Stack>
        </Stack>

        {/* <Button variant="contained" type="submit">
          Save
        </Button> */}
      </Stack>

      <Divider />

      <Stack gap={10}>
        {polls.map((poll, index) => (
          <PollOptionItem
            key={poll.id}
            index={index + 1}
            poll={poll}
            updatePoll={updatePoll}
            handleDeletePoll={handleDeletePoll}
            setErrors={setErrors}
            errors={errors}
          />
        ))}
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleAddPollOption}
        >
          Add
        </Button>
      </Stack>
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
    </Container>
  );
};

export default SnapPoll;
