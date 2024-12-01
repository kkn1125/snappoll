import { tokenAtom } from '@/recoils/token.atom';
import QuestionItem from '@components/atoms/QuestionItem';
import PollItem from '@components/moleculars/PollItem';
import { SnapPoll } from '@models/SnapPoll';
import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';

interface PollLayoutProps {
  poll: SnapPoll;
}
const PollLayout: React.FC<PollLayoutProps> = ({ poll }) => {
  const { user } = useRecoilValue(tokenAtom);

  return (
    <Stack gap={1}>
      <Stack direction="row" alignItems="baseline" gap={1}>
        <Typography fontSize={32} fontWeight={700}>
          {poll.title}
        </Typography>
        <Typography fontSize={14} fontWeight={700}>
          (작성자: {user?.username})
        </Typography>
      </Stack>
      {poll.description && (
        <Typography fontSize={14} fontWeight={300}>
          {poll.description}
        </Typography>
      )}
      <Typography>
        {dayjs(poll.expiresAt).format('YYYY. MM. DD HH:mm') + ' 까지' || ''}
      </Typography>
      <Stack gap={1}>
        <Divider sx={{ borderBottomWidth: 3, borderBottomStyle: 'dotted' }} />
      </Stack>
      <Stack gap={10}>
        {poll.question.map((question) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </Stack>
    </Stack>
  );
};

export default PollLayout;
