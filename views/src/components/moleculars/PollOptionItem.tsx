import {
  Button,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Poll } from '@utils/Poll';
import { ChangeEvent } from 'react';

interface PollOptionItemProps {
  index: number;
  poll: Poll<PollType['type']>;
  updatePoll: (poll: Poll<PollType['type']>) => void;
}
const PollOptionItem: React.FC<PollOptionItemProps> = ({
  index,
  poll,
  updatePoll,
}) => {
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const checked = target.checked;

    Object.assign(poll, { [name]: name === 'required' ? checked : value });
    updatePoll(poll);
  }

  function onSelectChange(e: SelectChangeEvent) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    Object.assign(poll, { [name]: value });
    updatePoll(poll);
  }

  function onChangeItemName(index: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const target = e.target;
      poll.items[index].name = target.value;
      updatePoll(poll);
    };
  }

  function onChangeItemValue(index: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const target = e.target;
      poll.items[index].value = target.value;
      updatePoll(poll);
    };
  }
  function onChangeItemChecked(index: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const target = e.target;
      (poll as Poll<'checkbox'>).items[index].checked = target.checked;
      updatePoll(poll);
    };
  }

  function handleAddItem() {
    poll.items.push({
      name: '',
      value: '',
      checked: false,
    });
    updatePoll(poll);
  }

  function handleDeleteItem(index: number) {
    return function () {
      poll.items = poll.items.filter((item, i) => index !== i);
      updatePoll(poll);
    };
  }

  return (
    <Paper component={Stack} gap={2} p={3}>
      <Stack direction="row" gap={2} alignItems="flex-end">
        <Typography whiteSpace="nowrap" fontSize={20} lineHeight={1.7}>
          질문 {index}.
        </Typography>
        <TextField
          name="label"
          size="small"
          placeholder="예시) 가장 선호하는 언어는 무엇인가요?"
          variant="filled"
          value={poll.label || ''}
          required
          fullWidth
          onChange={onChange}
          sx={{
            ['& input']: {
              pt: 1,
            },
          }}
        />
        <Stack position="relative">
          <Typography
            position="absolute"
            fontSize={14}
            bottom={'40%'}
            color="textDisabled"
            sx={{
              zIndex: 2,
              ml: 0.5,
              px: 0.2,
              backgroundColor: '#ffffff',
              transform: 'translateY(-50%)',
            }}
          >
            유형
          </Typography>
          <Select
            name="type"
            size="small"
            variant="outlined"
            value={poll.type || 'text'}
            onChange={onSelectChange}
            sx={{
              ['& legend']: {
                color: 'black',
              },
              ['& .MuiSelect-select']: { p: 0.7 },
              // ['&::before']: {
              //   borderBottom: 'none !important',
              // },
              // ['&:hover::before']: {
              //   borderBottom: 'none !important',
              // },
              // ['&::after']: {
              //   borderBottom: 'none !important',
              // },
              // ['&:hover::after']: {
              //   borderBottom: 'none !important',
              // },
            }}
          >
            <MenuItem value="text">직접입력</MenuItem>
            <MenuItem value="option">선택항목</MenuItem>
            <MenuItem value="checkbox">체크박스</MenuItem>
          </Select>
        </Stack>
        <Divider flexItem orientation="vertical" />
        <Stack direction="row" alignItems="center">
          <Typography component="label" whiteSpace="nowrap">
            <Switch
              id="required"
              name="required"
              size="medium"
              checked={poll.required || false}
              onChange={onChange}
            />
            필수여부
          </Typography>
        </Stack>
      </Stack>
      <Stack>
        <Typography fontSize={14} gutterBottom color="textDisabled">
          설명
        </Typography>
        <TextField
          name="desc"
          size="small"
          multiline
          placeholder=""
          rows={5}
          variant="filled"
          value={poll.desc || ''}
          onChange={onChange}
          sx={{
            ['& .MuiInputBase-root']: {
              pt: 1,
            },
          }}
        />
      </Stack>
      <Stack direction="row" justifyContent="space-between" gap={3}>
        <Stack direction="row" gap={2} flex={1}>
          <Stack>
            <Typography fontSize={14} gutterBottom color="textDisabled">
              분류
            </Typography>
            <TextField
              name="name"
              size="small"
              placeholder="예시) language"
              required
              variant="filled"
              value={poll.name || ''}
              onChange={onChange}
              sx={{
                ['& input']: {
                  pt: 1,
                },
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      <Divider orientation="horizontal" flexItem />

      {poll.type === 'text' && (
        <Stack direction="row" gap={2}>
          <Stack>
            <Typography fontSize={14} gutterBottom color="textDisabled">
              기본값
            </Typography>
            <TextField
              name="value"
              size="small"
              variant="filled"
              value={poll.value || ''}
              onChange={onChange}
              sx={{
                ['& input']: {
                  pt: 1,
                },
              }}
            />
          </Stack>
          <Stack>
            <Typography fontSize={14} gutterBottom color="textDisabled">
              도움말
            </Typography>
            <TextField
              name="placeholder"
              size="small"
              variant="filled"
              value={poll.placeholder}
              onChange={onChange}
              sx={{
                ['& input']: {
                  pt: 1,
                },
              }}
            />
          </Stack>
        </Stack>
      )}
      {poll.type === 'option' && (
        <Stack gap={2}>
          {(poll as Poll<'option'>).items.map((item, i) => (
            <Stack
              key={poll.id + '|' + i}
              direction="row"
              gap={2}
              alignItems="center"
            >
              <Typography fontSize={14} fontWeight={700}>
                {i + 1}
              </Typography>
              <TextField
                autoFocus
                placeholder="옵션명"
                size="small"
                value={item.name}
                name="name"
                onChange={onChangeItemName(i)}
                required
              />
              <TextField
                placeholder="옵션값"
                size="small"
                value={item.value}
                name="value"
                onChange={onChangeItemValue(i)}
                required
              />
              <Button
                color="error"
                variant="outlined"
                sx={{ minWidth: 'auto', px: 1 }}
                onClick={handleDeleteItem(i)}
              >
                ❌
              </Button>
            </Stack>
          ))}
          <Stack direction="row" gap={1}>
            <Button
              color="info"
              variant="outlined"
              onClick={handleAddItem}
              startIcon="➕"
            >
              추가
            </Button>
          </Stack>
        </Stack>
      )}
      {poll.type === 'checkbox' && (
        <Stack gap={1}>
          {(poll as Poll<'checkbox'>).items.map((item, i) => (
            <Stack
              key={poll.id + '|' + i}
              direction="row"
              gap={1}
              alignItems="center"
            >
              <Typography fontSize={14} fontWeight={700}>
                {i + 1}
              </Typography>
              <TextField
                autoFocus
                placeholder="옵션명"
                size="small"
                value={item.name}
                onChange={onChangeItemName(i)}
                required
              />
              <Switch
                size="medium"
                checked={item.checked}
                onChange={onChangeItemChecked(i)}
              />
              <Button
                color="error"
                variant="outlined"
                sx={{ minWidth: 'auto', px: 1 }}
                onClick={handleDeleteItem(i)}
              >
                ❌
              </Button>
            </Stack>
          ))}
          <Stack direction="row" gap={1}>
            <Button
              color="info"
              variant="outlined"
              onClick={handleAddItem}
              startIcon="➕"
            >
              추가
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

export default PollOptionItem;
