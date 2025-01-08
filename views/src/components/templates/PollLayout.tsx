import { tokenAtom } from '@/recoils/token.atom';
import QuestionItem from '@components/atoms/QuestionItem';
import ShareControlButton from '@components/atoms/ShareControlButton';
import { SnapPoll } from '@models/SnapPoll';
import { AccessTime } from '@mui/icons-material';
import { Alert, AlertTitle, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { formattedDate } from '@utils/formattedDate';
import { getUsernameOr } from '@utils/getUsernameOr';
import { printDateOrNot } from '@utils/printDateOrNot';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PollLayoutProps {
  poll: SnapPoll;
  expired: boolean;
  refetchPoll: () => void;
}
const PollLayout: React.FC<PollLayoutProps> = ({
  poll,
  expired,
  refetchPoll,
}) => {
  const { user } = useRecoilValue(tokenAtom);
  const locate = useLocation();
  const isShare = locate.pathname.startsWith('/service/poll/share');

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
        <Stack
          alignItems="flex-end"
          mb={2}
          flex={1}
          gap={1}
          sx={{ backgroundColor: '#f9f9f9', padding: 2, borderRadius: 2 }}
        >
          <Typography
            className="font-maru"
            fontSize={18}
            fontWeight={600}
            color="#333"
          >
            {getUsernameOr(poll.user?.username)} 작성
          </Typography>

          <Stack direction="row" alignItems="center" gap={1}>
            <AccessTime fontSize="small" color={expired ? 'error' : 'action'} />
            <Typography
              className="font-maru"
              fontSize={16}
              color={expired ? 'error' : '#555'}
            >
              {printDateOrNot(poll.expiresAt)}
            </Typography>
          </Stack>

          <Typography
            className="font-maru"
            fontSize={14}
            fontWeight={400}
            color="#777"
          >
            (문항 {poll.question.length}개)
          </Typography>
          {!isShare && (
            <ShareControlButton data={poll} user={user} refetch={refetchPoll} />
          )}
        </Stack>
      </Stack>

      {poll.description && (
        <Typography
          className="font-maru"
          fontSize={14}
          fontWeight={300}
          sx={{
            p: 3,
            backgroundColor: grey['100'],
            borderRadius: 1,
            borderLeft: '5px solid #aaa',
            mb: 5,
            whiteSpace: 'pre-wrap',
            textBreak: 'auto-phrase',
          }}
        >
          {poll.description}
        </Typography>
      )}

      {expired ? (
        <Alert severity="warning">
          <AlertTitle>안내</AlertTitle> {formattedDate(poll.expiresAt) + ' '}에
          마감된 설문입니다.
        </Alert>
      ) : (
        <Stack gap={10}>
          {poll.question.map((question) => (
            <QuestionItem key={question.id} question={question} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default PollLayout;
