import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  Checkbox,
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
  }, []);

  const handleChangeCheckbox = useCallback(
    (e: SyntheticEvent, checked: boolean) => {
      const name = (e.target as HTMLInputElement).name;
      setSnapResponse((response) => {
        const copyResponse = SnapResponse.copy(response);
        if (checked) {
          if (!question.isMultiple) {
            copyResponse.answer = [];
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
    [],
  );

  return (
    <Stack>
      <Typography fontSize={24} fontWeight={700}>
        {question.title}
      </Typography>
      <Typography variant="subtitle2">{question.description}</Typography>
      {question.type === 'text' ? (
        <TextField onChange={handleChange} />
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
                borderRadius: 0.5,
                p: 2,
              }}
            >
              <FormControlLabel
                label="기타"
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
                control={<Checkbox name="useEtc" />}
              />
            </ListItemButton>
          )}
          {useEtc && (
            <TextField
              name="value"
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
