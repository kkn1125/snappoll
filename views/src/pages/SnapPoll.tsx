import { addPoll } from '@/apis/addPoll';
import PollOptionItem from '@components/moleculars/PollOptionItem';
import useSnapPoll from '@hooks/useSnapPoll';
import {
  Button,
  Container,
  Divider,
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
import { ChangeEvent, FormEvent, useState } from 'react';

interface SnapPollProps {}
const SnapPoll: React.FC<SnapPollProps> = () => {
  const { setSnapPolls } = useSnapPoll();
  const [baseInfo, setBaseInfo] = useState<Record<string, string | Date>>({
    title: '',
    description: '',
    start: new Date(),
    expiresAt: new Date(),
  });
  const [polls, setPolls] = useState<Poll<PollType['type']>[]>([]);

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
      context: PickerChangeHandlerContext<DateTimeValidationError>,
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
    console.log(baseInfo, polls);

    if (polls.length === 0) return;

    setSnapPolls(polls);
    addPoll({ ...rest, options: JSON.stringify(polls) });

    return false;
  }

  return (
    <Container component={Stack} p={5} gap={3}>
      <Stack
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

        <Button variant="contained" type="submit">
          Save
        </Button>
      </Stack>

      <Divider />

      <Stack gap={10}>
        {polls.map((poll, index) => (
          <PollOptionItem
            key={poll.id}
            index={index + 1}
            poll={poll}
            updatePoll={updatePoll}
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
    </Container>
  );
};

export default SnapPoll;
