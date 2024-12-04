import { snapPollAtom } from '@/recoils/snapPoll.atom';
import { snapVoteAtom } from '@/recoils/snapVote.atom';
import CustomInput from '@components/atoms/CustomInput';
import { SnapVote } from '@models/SnapVote';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import {
  DateTimePicker,
  DateTimeValidationError,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ChangeEvent, useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

interface CreateVoteFormProps {
  errors: ErrorMessage<SnapVote>;
}
const CreateVoteForm: React.FC<CreateVoteFormProps> = ({ errors }) => {
  const [useExpires, setUseExpires] = useState(true);
  const [snapVote, setSnapVote] = useRecoilState(snapVoteAtom);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSnapVote((snapVote) => {
      const copySnapVote = SnapVote.copy(snapVote);
      Object.assign(copySnapVote, { [name]: value });
      return copySnapVote;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateExpiresTime = useCallback((name: string) => {
    return (
      value: dayjs.Dayjs | null,
      _context: PickerChangeHandlerContext<DateTimeValidationError>,
    ) => {
      setSnapVote((snapVote) => {
        const newSnapVote = SnapVote.copy(snapVote);
        newSnapVote['expiresAt'] = value?.toDate() || new Date();
        return newSnapVote;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={3}>
      <Typography fontSize={28} fontWeight={700}>
        투표지 제작
      </Typography>
      <CustomInput
        label="제목"
        name="title"
        value={snapVote.title}
        required
        autoFocus
        variant="filled"
        type="text"
        errors={errors}
        onChange={onChange}
      />
      <CustomInput
        label="개요"
        name="description"
        value={snapVote.description}
        required
        multiline
        rows={5}
        variant="filled"
        type="text"
        errors={errors}
        onChange={onChange}
      />
      <Stack gap={1}>
        <Typography fontSize={20} fontWeight={700}>
          투표 기간
        </Typography>
        <Stack direction="row" gap={1} alignItems="center">
          <DateTimePicker
            disabled={!useExpires}
            format="YYYY. MM. DD. HH:mm"
            value={dayjs(snapVote.expiresAt)}
            sx={{
              ['&, & .MuiInputBase-root']: {
                maxHeight: 40,
              },
            }}
            onChange={updateExpiresTime('expiresAt')}
            // minDateTime={dayjs()}
          />
          <FormControlLabel
            label="투표 기간 설정"
            onChange={(e, checked) => {
              if (checked) {
                setSnapVote((snapVote) => {
                  const newSnapVote = SnapVote.copy(snapVote);
                  newSnapVote['expiresAt'] = undefined;
                  return newSnapVote;
                });
              }
              setUseExpires(checked);
            }}
            control={<Switch checked={useExpires} />}
          />
        </Stack>
      </Stack>

      <Stack direction="row" gap={1} alignItems="center">
        <FormControlLabel
          label="다중 선택 허용"
          onChange={(e, checked) => {
            setSnapVote((snapVote) => {
              const newSnapVote = SnapVote.copy(snapVote);
              newSnapVote['isMultiple'] = checked;
              return newSnapVote;
            });
          }}
          control={<Switch checked={snapVote.isMultiple} />}
        />
        <FormControlLabel
          label="기타"
          checked={snapVote.useEtc}
          onChange={(e, checked) => {
            setSnapVote((snapVote) => {
              const newSnapVote = SnapVote.copy(snapVote);
              newSnapVote['useEtc'] = checked;
              return newSnapVote;
            });
          }}
          control={<Switch name="useEtc" />}
        />
      </Stack>
    </Stack>
  );
};

export default CreateVoteForm;
