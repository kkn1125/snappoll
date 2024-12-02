import { snapPollAtom } from '@/recoils/snapPoll.atom';
import CustomInput from '@components/atoms/CustomInput';
import { SnapPoll } from '@models/SnapPoll';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import {
  DateTimePicker,
  DateTimeValidationError,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

interface CreatePollFormProps {
  errors: ErrorMessage<SnapPoll>;
}
const CreatePollForm: React.FC<CreatePollFormProps> = ({ errors }) => {
  const [useExpires, setUseExpires] = useState(true);
  const [snapPoll, setSnapPoll] = useRecoilState(snapPollAtom);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSnapPoll((snapPoll) => {
      const newSnapPoll = SnapPoll.copy(snapPoll);
      Object.assign(newSnapPoll, { [name]: value });
      return newSnapPoll;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateExpiresTime = useCallback((name: string) => {
    return (
      value: dayjs.Dayjs | null,
      _context: PickerChangeHandlerContext<DateTimeValidationError>,
    ) => {
      setSnapPoll((snapPoll) => {
        const newSnapPoll = SnapPoll.copy(snapPoll);
        newSnapPoll['expiresAt'] = value?.toDate() || new Date();
        return newSnapPoll;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={3}>
      <Typography fontSize={28} fontWeight={700}>
        설문지 제작
      </Typography>
      <CustomInput
        label="제목"
        name="title"
        value={snapPoll.title}
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
        value={snapPoll.description}
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
          설문 기간
        </Typography>
        <Stack direction="row" gap={1} alignItems="center">
          <DateTimePicker
            disabled={!useExpires}
            format="YYYY. MM. DD. HH:mm"
            value={dayjs(snapPoll.expiresAt)}
            sx={{
              ['&, & .MuiInputBase-root']: {
                maxHeight: 40,
              },
            }}
            onChange={updateExpiresTime('expiresAt')}
            // minDateTime={dayjs()}
          />
          <FormControlLabel
            label="설문 기간 설정"
            onChange={(e, checked) => {
              if (checked) {
                setSnapPoll((snapPoll) => {
                  const newSnapPoll = SnapPoll.copy(snapPoll);
                  newSnapPoll['expiresAt'] = undefined;
                  return newSnapPoll;
                });
              }
              setUseExpires(checked);
            }}
            control={<Switch checked={useExpires} />}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(CreatePollForm);
