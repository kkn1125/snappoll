import { tokenAtom } from '@/recoils/token.atom';
import AnswerItem from '@components/atoms/AnswerItem';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import { Stack, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { getUsernameOr } from '@utils/getUsernameOr';
import { printDateOrNot } from '@utils/printDateOrNot';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PollResponseLayoutProps {
  poll: SnapPoll;
  contributor?: string;
}
const PollResponseLayout: React.FC<PollResponseLayoutProps> = ({
  poll,
  contributor,
}) => {
  const { user } = useRecoilValue(tokenAtom);
  const { responseId } = useParams();
  const getRespondAnswers = useCallback(
    (question: SnapPollQuestion) => {
      return (
        question.answer?.filter((ans) => ans.responseId === responseId) ?? []
      );
    },
    [responseId],
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
          {poll.title}
        </Typography>
        <Stack alignItems="flex-end" mb={1} flex={1} gap={1}>
          <Typography className="font-maru" fontSize={16} fontWeight={100}>
            {getUsernameOr(poll.user?.username)}
          </Typography>

          <Typography className="font-maru" fontSize={16}>
            {printDateOrNot(poll.expiresAt)}
          </Typography>

          <Typography className="font-maru" fontSize={14} fontWeight={100}>
            (문항 {poll.question.length}개)
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

      {poll.description && (
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
          {poll.description}
        </Typography>
      )}

      <Toolbar />

      <Stack gap={10}>
        {poll.question.map((question) => (
          <AnswerItem
            key={question.id}
            question={question}
            answers={getRespondAnswers(question)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default PollResponseLayout;
