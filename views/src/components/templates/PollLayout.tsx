import PollItem from '@components/moleculars/PollItem';
import { Divider, Stack, Typography } from '@mui/material';
import { Poll } from '@utils/Poll';
import dayjs from 'dayjs';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

interface PollLayoutProps {
  data: APIPoll;
  polls: Poll<PollType['type']>[];
  setPolls: Dispatch<SetStateAction<Poll<PollType['type']>[]>>;
}
const PollLayout: React.FC<PollLayoutProps> = ({ data, polls, setPolls }) => {
  function onChange(id: string, value: string | boolean) {
    setPolls((polls) => {
      return polls.map((poll) => {
        if (poll.id === id) {
          const newItems = [...poll.items];
          if (typeof value === 'boolean') {
            poll.value = value;
          } else {
            poll.value = value;
          }
          poll.items = newItems;
        }
        return poll;
      });
    });
  }

  function onChangeCheckbox(id: string, index: number, checked: boolean) {
    setPolls((polls) => {
      return polls.map((poll) => {
        if (poll.id === id) {
          const newItems = [...poll.items];
          newItems[index].checked = checked;
          poll.items = newItems;
        }
        return poll;
      });
    });
  }

  function onChangeEtc(id: string, value: string) {
    setPolls((polls) => {
      return polls.map((poll) => {
        if (poll.id === id) {
          poll.etc = value;
        }
        return poll;
      });
    });
  }

  return (
    <Stack gap={1}>
      <Stack direction="row" alignItems="baseline" gap={1}>
        <Typography fontSize={32} fontWeight={700}>
          {data?.title}
        </Typography>
        <Typography fontSize={14} fontWeight={700}>
          (작성자: {data?.user?.username})
        </Typography>
      </Stack>
      {data?.description && (
        <Typography fontSize={14} fontWeight={300}>
          {data?.description}
        </Typography>
      )}
      <Typography>
        {dayjs(data?.expiresAt).format('YYYY. MM. DD HH:mm') + ' 까지' || ''}
      </Typography>
      <Stack gap={1}>
        <Divider sx={{ borderBottomWidth: 3, borderBottomStyle: 'dotted' }} />
      </Stack>
      <Stack gap={10}>
        {polls.map((poll) => (
          <PollItem
            key={poll.id}
            poll={poll}
            onChange={onChange}
            onChangeCheckbox={onChangeCheckbox}
            onChangeEtc={onChangeEtc}
          />
        ))}
        {/* {polls.map((poll, i) => (
          <PollItem key={poll.name + i} poll={poll} />
        ))} */}
      </Stack>
    </Stack>
  );
};

export default PollLayout;
