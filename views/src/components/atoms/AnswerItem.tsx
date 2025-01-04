import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  unstable_createMuiStrictModeTheme,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import CheckedComponent from './CheckedComponent';
import { SnapAnswer } from '@models/SnapAnswer';

interface AnswerItemProps {
  question: SnapPollQuestion;
  answers?: SnapAnswer[];
}
const AnswerItem: React.FC<AnswerItemProps> = ({ question, answers }) => {
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

  const etc = useMemo(() => {
    return answers?.find((answer) => answer.value);
  }, [answers]);

  const getSelected = useCallback(
    (optionId: string) => {
      // console.log(answers, optionId);
      return answers?.some((ans) => ans.optionId === optionId);
    },
    [answers],
  );

  const textAnswer = useMemo(
    () => answers?.find((answer) => !answer.optionId),
    [answers],
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
          value={textAnswer?.value || ''}
        />
      ) : (
        <List component={Stack} gap={1}>
          {question.option?.map((option) => (
            <ListItemButton
              key={option.id}
              component="label"
              {...isDeactivateStyle(!!getSelected(option.id))}
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                // p: 2,
              }}
            >
              <CheckedComponent checked={!!getSelected(option.id)} />
              <ListItemText>{option.content}</ListItemText>
            </ListItemButton>
          ))}
          {question.useEtc && (
            <ListItemButton
              {...isDeactivateStyle(!!etc)}
              component="label"
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={!!etc} />
              <ListItemText>기타</ListItemText>
            </ListItemButton>
          )}
          {etc && (
            <TextField
              variant="filled"
              value={etc?.value || ''}
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
