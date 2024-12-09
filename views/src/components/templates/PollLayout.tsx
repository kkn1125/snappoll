import { tokenAtom } from '@/recoils/token.atom';
import QuestionItem from '@components/atoms/QuestionItem';
import { SnapPoll } from '@models/SnapPoll';
import { AccessTime } from '@mui/icons-material';
import { Alert, AlertTitle, Stack, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { formattedDate } from '@utils/formattedDate';
import { printDateOrNot } from '@utils/printDateOrNot';
import { useRecoilValue } from 'recoil';

interface PollLayoutProps {
  poll: SnapPoll;
  expired: boolean;
}
const PollLayout: React.FC<PollLayoutProps> = ({ poll, expired }) => {
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
            {poll.user?.username} 작성
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
            // borderTopRightRadius: 1,
            // borderBottomRightRadius: 1,
            borderLeft: '5px solid #aaa',
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
