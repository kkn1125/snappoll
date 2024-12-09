import CheckedComponent from '@components/atoms/CheckedComponent';
import VoteAnswerItem from '@components/atoms/VoteAnswerItem';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteAnswer } from '@models/SnapVoteAnswer';
import {
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { printDateOrNot } from '@utils/printDateOrNot';
import { useCallback } from 'react';

interface VoteResponseLayoutProps {
  vote: SnapVote;
  answer: SnapVoteAnswer[];
  contributor?: string;
}
const VoteResponseLayout: React.FC<VoteResponseLayoutProps> = ({
  vote,
  answer,
  contributor,
}) => {
  const getAnswer = useCallback(() => {
    return answer.find((ans) => ans.voteOptionId === null);
  }, [answer]);

  const getSelected = useCallback(
    (optionId: string) => {
      return answer.some((ans) => ans.voteOptionId === optionId);
    },
    [answer],
  );

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
    <Stack gap={1}>
      <Stack justifyContent="baseline" gap={1}>
        <Typography
          className="font-maru"
          fontSize={32}
          fontWeight={700}
          align="center"
          gutterBottom
        >
          {vote.title}
        </Typography>
        <Stack alignItems="flex-end" mb={1} flex={1} gap={1}>
          <Typography className="font-maru" fontSize={16} fontWeight={100}>
            {vote.user?.username}
          </Typography>

          <Typography className="font-maru" fontSize={16}>
            {printDateOrNot(vote.expiresAt)}
          </Typography>

          <Typography
            className="font-maru"
            color="info"
            fontSize={14}
            fontWeight={700}
          >
            (참여자: {contributor})
          </Typography>
        </Stack>
      </Stack>

      <Toolbar />

      {vote.description && (
        <Typography
          className="font-maru"
          fontSize={14}
          fontWeight={300}
          sx={{
            p: 3,
            backgroundColor: grey['100'],
            borderRadius: 1,
            // borderTopRightRadius: 1,
            // borderBottomRightRadius: 1,
            borderLeft: '5px solid #aaa',
          }}
        >
          {vote.description}
        </Typography>
      )}

      <Toolbar />

      <Stack gap={10}>
        <List component={Stack} gap={1}>
          {vote.voteOption.map((option) => (
            <VoteAnswerItem
              key={option.id}
              option={option}
              isSelected={getSelected(option.id)}
            />
          ))}
          {vote.useEtc && (
            <ListItemButton
              {...isDeactivateStyle(!!getAnswer())}
              component="label"
              sx={{
                border: '1px solid #eee',
                borderRadius: 1,
                p: 2,
              }}
            >
              <CheckedComponent checked={!!getAnswer()} />
              <ListItemText>기타</ListItemText>
            </ListItemButton>
          )}
          {vote.useEtc && getAnswer() && (
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
      </Stack>
    </Stack>
  );
};

export default VoteResponseLayout;
