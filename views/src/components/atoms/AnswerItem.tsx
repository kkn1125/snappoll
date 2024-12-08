import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import CheckedComponent from './CheckedComponent';
import { SnapAnswer } from '@models/SnapAnswer';

interface AnswerItemProps {
  question: SnapPollQuestion;
  answer?: SnapAnswer;
}
const AnswerItem: React.FC<AnswerItemProps> = ({ question, answer }) => {
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

  const isEtc = useMemo(() => {
    return !!answer?.value;
  }, [answer]);

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
          value={answer?.value}
        />
      ) : (
        <List component={Stack} gap={1}>
          {question.option?.map((option) => (
            <ListItemButton
              key={option.id}
              component="label"
              {...isDeactivateStyle(answer?.optionId === option.id)}
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={answer?.optionId === option.id} />
              <ListItemText>{option.content}</ListItemText>
            </ListItemButton>
          ))}
          {question.useEtc && (
            <ListItemButton
              {...isDeactivateStyle(isEtc)}
              component="label"
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={isEtc} />
              <ListItemText>기타</ListItemText>
            </ListItemButton>
          )}
          {isEtc && (
            <TextField
              variant="filled"
              value={answer?.value}
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
