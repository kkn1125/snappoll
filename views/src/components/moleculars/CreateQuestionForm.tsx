import { snapPollAtom } from '@/recoils/snapPoll.atom';
import CustomInput from '@components/atoms/CustomInput';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollOption } from '@models/SnapPollOption';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  Button,
  FormControlLabel,
  IconButton,
  List,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  memo,
  SetStateAction,
  SyntheticEvent,
  useCallback,
} from 'react';
import { useSetRecoilState } from 'recoil';
import CreateOptionForm from './CreateOptionForm';
import DeleteIcon from '@mui/icons-material/Delete';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import ListIcon from '@mui/icons-material/List';

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
  const { openInteractiveModal } = useModal();
  const setSnapPoll = useSetRecoilState(snapPollAtom);
  // const [type, setType] = useState('text');
  // const [options, setOptions] = useState<SnapPollOption[]>([
  //   new SnapPollOption(),
  // ]);

  const handleRemove = useCallback((questionId: string) => {
    openInteractiveModal(Message.Single.Remove, () => {
      setSnapPoll((snapPoll) => {
        const copySnapPoll = SnapPoll.copy(snapPoll);
        copySnapPoll.question = copySnapPoll.question.filter(
          (question) => question.id !== questionId,
        );
        return copySnapPoll;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof SnapPollQuestion;
    const value = e.target.value;
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.updateQuestionByInfo(question.id, name, value);
      return copyPoll;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Stack gap={2}>
        <Stack
          direction="row"
          gap={2}
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography fontSize={18} fontWeight={700}>
            {index}
          </Typography>
          <CustomInput
            // label="제목"
            autoFocus
            placeholder="질문"
            name="title"
            type="text"
            value={question.title}
            required
            variant="filled"
            onChange={onChange}
            errors={errors}
            sx={{
              minWidth: '50%',
              flex: 1,
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
            sx={{ minWidth: 100 }}
            required
          >
            <MenuItem value="text">입력</MenuItem>
            <MenuItem value="select">선택</MenuItem>
            <MenuItem value="checkbox">체크박스</MenuItem>
          </Select>
          <IconButton color="error" onClick={() => handleRemove(question.id)}>
            <DeleteIcon />
          </IconButton>
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
        <Stack>
          <FormControlLabel
            label="필수 여부"
            checked={question.isRequired}
            onChange={handleChangeOnOff}
            control={<Switch name="isRequired" />}
          />
          {question.type !== 'text' && (
            <Fragment>
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
            </Fragment>
          )}
        </Stack>

        {question.type !== 'text' && (
          <List
            sx={{
              listStyle: 'none',
              counterReset: 'list-counter',
              position: 'relative',
              ['& .MuiInputBase-root']: {
                counterIncrement: 'list-counter',
              },
              ['& .MuiInputBase-root::before']: {
                content: 'counter(list-counter) ". "',
                position: 'absolute',
                left: -20,
                fontSize: 20,
                lineHeight: 1.5,
              },
            }}
          >
            {question.option.map((option, i) => (
              <CreateOptionForm
                key={option.id}
                questionId={question.id}
                option={option}
              />
            ))}
            <Button
              fullWidth
              variant="outlined"
              onClick={addOption}
              startIcon={<ListIcon />}
            >
              항목 추가
            </Button>
          </List>
        )}
      </Stack>
    </Paper>
  );
};

export default memo(CreateQuestionForm);
