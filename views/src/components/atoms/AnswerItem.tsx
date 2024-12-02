import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import CheckedComponent from './CheckedComponent';

interface AnswerItemProps {
  question: SnapPollQuestion;
}
const AnswerItem: React.FC<AnswerItemProps> = ({ question }) => {
  const getAnswer = useCallback((optionId: string | null = null) => {
    return question.answer?.find(
      (answer) =>
        question.id === answer.questionId && answer.optionId === optionId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDeactivateStyle = useCallback(
    (isDeactive: boolean) =>
      isDeactive
        ? {}
        : {
            disabled: true,
            background: '#eeeeee56',
          },
    [],
  );

  return (
    <Stack>
      <Typography className="font-maru" fontSize={24} fontWeight={700}>
        {question.title}
      </Typography>
      <Typography className="font-maru" variant="subtitle2">
        {question.description}
      </Typography>
      {question.type === 'text' ? (
        <TextField
          variant="filled"
          slotProps={{
            input: {
              className: 'font-maru',
            },
          }}
          disabled
          value={getAnswer()?.value}
        />
      ) : (
        <List component={Stack} gap={1}>
          {question.option?.map((option) => (
            <ListItemButton
              key={option.id}
              component="label"
              {...isDeactivateStyle(!!getAnswer(option.id))}
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={!!getAnswer(option.id)} />
              <ListItemText>{option.content}</ListItemText>
            </ListItemButton>
          ))}
          {question.useEtc && (
            <ListItemButton
              {...isDeactivateStyle(question.useEtc)}
              component="label"
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={question.useEtc} />
              <ListItemText>기타</ListItemText>
            </ListItemButton>
          )}
          {question.useEtc && (
            <TextField
              variant="filled"
              value={getAnswer()?.value}
              disabled
              slotProps={{
                input: {
                  className: 'font-maru',
                },
              }}
            />
          )}
        </List>
      )}
    </Stack>
  );
};

export default AnswerItem;
