import { snapPollAtom } from '@/recoils/snapPoll.atom';
import CustomInput from '@components/atoms/CustomInput';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollOption } from '@models/SnapPollOption';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  Button,
  FormControlLabel,
  List,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { ChangeEvent, memo, SyntheticEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import CreateOptionForm from './CreateOptionForm';

interface CreateQuestionFormProps {
  index: number;
  errors: ErrorMessage<SnapPollQuestion>;
  question: SnapPollQuestion;
}
const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({
  index,
  question,
  errors,
}) => {
  const setSnapPoll = useSetRecoilState(snapPollAtom);
  // const [type, setType] = useState('text');
  // const [options, setOptions] = useState<SnapPollOption[]>([
  //   new SnapPollOption(),
  // ]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof SnapPollQuestion;
    const value = e.target.value;
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.updateQuestionByInfo(question.id, name, value);
      return copyPoll;
    });
  }, []);

  const addOption = useCallback(() => {
    const newOption = new SnapPollOption();
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      const copyQuestion = SnapPollQuestion.copy(question);
      copyQuestion.addOption(newOption);
      copyPoll.updateQuestion(copyQuestion);
      return copyPoll;
    });
  }, [question, setSnapPoll]);

  const handleChangeType = useCallback((e: SelectChangeEvent) => {
    const value = e.target.value;
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.updateQuestionByInfo(question.id, 'type', value);
      return copyPoll;
    });
  }, []);

  const handleChangeOnOff = useCallback(
    (e: SyntheticEvent, checked: boolean) => {
      const name = (e.target as HTMLInputElement).name as keyof Question;
      setSnapPoll((snapPoll) => {
        const copyPoll = SnapPoll.copy(snapPoll);
        copyPoll.updateQuestionByInfo(question.id, name, checked);
        return copyPoll;
      });
    },
    [],
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Stack gap={2}>
        <Stack
          direction="row"
          gap={2}
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography fontSize={18} fontWeight={700}>
            {index}
          </Typography>
          <CustomInput
            // label="제목"
            fullWidth
            placeholder="질문"
            name="title"
            type="text"
            value={question.title}
            required
            variant="filled"
            onChange={onChange}
            errors={errors}
            sx={{
              ['& .MuiInputBase-root']: {
                fontSize: 18,
                fontWeight: 700,
                minHeight: 40,
                ['& .MuiInputBase-input']: {
                  pt: 1,
                },
              },
            }}
          />
          <Select
            name="type"
            value={question.type}
            size="small"
            onChange={handleChangeType}
            sx={{ minWidth: 200 }}
            required
          >
            <MenuItem value="text">입력</MenuItem>
            <MenuItem value="select">선택</MenuItem>
            <MenuItem value="checkbox">체크박스</MenuItem>
          </Select>
        </Stack>
        <CustomInput
          label="설명"
          name="description"
          type="text"
          multiline
          variant="filled"
          rows={3}
          value={question.description || ''}
          onChange={onChange}
          errors={errors}
        />
        {question.type !== 'text' && (
          <Stack>
            <Button onClick={addOption}>추가</Button>
            <FormControlLabel
              label="필수 여부"
              checked={question.isRequired}
              onChange={handleChangeOnOff}
              control={<Switch name="isRequired" />}
            />
            {question.type === 'checkbox' && (
              <FormControlLabel
                label="다중 선택 허용"
                checked={question.isMultiple}
                onChange={handleChangeOnOff}
                control={<Switch name="isMultiple" />}
              />
            )}
            <FormControlLabel
              label="기타 항목 추가"
              checked={question.useEtc}
              onChange={handleChangeOnOff}
              control={<Switch name="useEtc" />}
            />
          </Stack>
        )}
        <List>
          {question.option.map((option) => (
            <CreateOptionForm
              key={option.id}
              questionId={question.id}
              option={option}
            />
          ))}
        </List>
      </Stack>
    </Paper>
  );
};

export default memo(CreateQuestionForm);
