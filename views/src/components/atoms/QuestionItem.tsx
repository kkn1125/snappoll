import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import OptionItem from './OptionItem';
import {
  ChangeEvent,
  memo,
  SyntheticEvent,
  useCallback,
  useState,
} from 'react';
import { useSetRecoilState } from 'recoil';
import { snapResponseAtom } from '@/recoils/snapResponse.atom';
import { SnapResponse } from '@models/SnapResponse';
import { SnapAnswer } from '@models/SnapAnswer';
import CheckedComponent from './CheckedComponent';
import { grey } from '@mui/material/colors';

interface QuestionItemProps {
  question: SnapPollQuestion;
}
const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const [useEtc, setUseEtc] = useState(false);
  const setSnapResponse = useSetRecoilState(snapResponseAtom);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapResponse((response) => {
      const copyResponse = SnapResponse.copy(response);
      const answer = copyResponse.hasTextQuestion(question.id);
      if (answer) {
        copyResponse.updateAnswer(answer.id, value);
      } else {
        const newAnswer = new SnapAnswer();
        newAnswer.id = question.id;
        newAnswer.questionId = question.id;
        newAnswer.optionId = undefined;
        newAnswer.value = value;
        copyResponse.addAnswer(newAnswer);
      }
      return copyResponse;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearValue = useCallback(() => {
    setSnapResponse((response) => {
      const copyResponse = SnapResponse.copy(response);
      const answer = copyResponse.hasQuestion(question.id);
      if (answer) {
        copyResponse.updateAnswer(answer.id, undefined);
      }
      return copyResponse;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeCheckbox = useCallback(
    (e: SyntheticEvent, checked: boolean) => {
      const name = (e.target as HTMLInputElement).name;
      setSnapResponse((response) => {
        const copyResponse = SnapResponse.copy(response);
        if (checked) {
          if (!question.isMultiple) {
            copyResponse.answer = copyResponse.answer.filter(
              (answer) => answer.questionId !== question.id,
            );
            setUseEtc(false);
          }
          const option = copyResponse.hasOption(name);
          if (!option) {
            const newAnswer = new SnapAnswer();
            newAnswer.id = question.id;
            newAnswer.questionId = question.id;
            newAnswer.optionId = name;
            copyResponse.addAnswer(newAnswer);
          }
        } else {
          const option = copyResponse.hasOption(name);
          if (option) {
            copyResponse.removeOption(name);
          }
        }
        return copyResponse;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Stack>
      <Stack>
        <Typography className="font-maru" fontSize={24} fontWeight={700}>
          {question.title}
        </Typography>
        <Typography
          className="font-maru"
          variant="subtitle2"
          // fontSize={14}
          // fontWeight={100}
          sx={{
            p: 1,
            backgroundColor: grey['100'],
            borderRadius: 1,
            borderLeft: '2px solid #aaa',
            mt: 1,
            mb: 2,
          }}
        >
          {question.description}
        </Typography>
        <Stack direction="row" my={1} gap={1}>
          {question.type !== 'text' && (
            <Chip
              color={question.isMultiple ? 'info' : 'default'}
              size="small"
              label={question.isMultiple ? '다중 선택' : '단일 선택'}
            />
          )}
          <Chip
            color={question.isRequired ? 'error' : 'default'}
            size="small"
            label={question.isRequired ? '필수' : '선택'}
          />
        </Stack>
      </Stack>
      {question.type === 'text' ? (
        <TextField
          variant="filled"
          onChange={handleChange}
          slotProps={{
            input: {
              className: 'font-maru',
            },
          }}
          placeholder={question.isRequired ? '작성해주세요.' : '작성해주세요.'}
        />
      ) : (
        <List component={Stack} gap={1}>
          {question.option.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              onChange={handleChangeCheckbox}
            />
          ))}
          {question.useEtc && (
            <ListItemButton
              component="label"
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={useEtc} />
              <FormControlLabel
                label="기타"
                slotProps={{
                  typography: {
                    className: 'font-maru',
                  },
                }}
                checked={useEtc}
                onChange={(e, checked) => {
                  if (!checked) {
                    handleClearValue();
                  } else {
                    if (!question.isMultiple) {
                      setSnapResponse((response) => {
                        const copyResponse = SnapResponse.copy(response);
                        copyResponse.answer = [];
                        return copyResponse;
                      });
                    }
                  }
                  setUseEtc(checked);
                }}
                control={<Checkbox name="useEtc" sx={{ display: 'none' }} />}
              />
            </ListItemButton>
          )}
          {useEtc && (
            <TextField
              variant="filled"
              name="value"
              slotProps={{
                input: {
                  className: 'font-maru',
                },
              }}
              placeholder="작성해주세요."
              onChange={handleChange}
            />
          )}
        </List>
      )}
    </Stack>
  );
};

export default memo(QuestionItem);
