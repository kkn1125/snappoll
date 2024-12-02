import { tokenAtom } from '@/recoils/token.atom';
import QuestionItem from '@components/atoms/QuestionItem';
import { SnapPoll } from '@models/SnapPoll';
import { Stack, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';

interface PollLayoutProps {
  poll: SnapPoll;
}
const PollLayout: React.FC<PollLayoutProps> = ({ poll }) => {
  const { user } = useRecoilValue(tokenAtom);

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
            {user?.username}
          </Typography>

          <Typography className="font-maru" fontSize={16}>
            {(poll.expiresAt &&
              dayjs(poll.expiresAt).format('YYYY. MM. DD HH:mm') + ' 까지') ||
              ''}
          </Typography>

          <Typography className="font-maru" fontSize={14} fontWeight={100}>
            (문항 {poll.question.length}개)
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
          <QuestionItem key={question.id} question={question} />
        ))}
      </Stack>
    </Stack>
  );
};

export default PollLayout;
