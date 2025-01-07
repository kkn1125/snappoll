import { getSharePoll } from '@apis/poll/share/getSharePoll';
import useToken from '@hooks/useToken';
import { SnapSharePoll } from '@models/SnapSharePoll';
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  Stack,
  Typography
} from '@mui/material';
import Notfound from '@pages/NotfoundPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import DetailPollPage from '../DetailPollPage';

interface SharePollProps {
  url: string;
}
const SharePoll: React.FC<SharePollProps> = ({ url }) => {
  const queryClient = useQueryClient();
  const { user } = useToken();
  const { data, isLoading } = useQuery<SnapResponseType<SnapSharePoll>>({
    queryKey: ['sharePoll', url],
    queryFn: () => getSharePoll(url),
  });
  const refetchShare = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['sharePoll'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return (
      <Stack justifyContent="center" alignItems="center" height="inherit">
        <Typography variant="h3" fontWeight={700} className="font-maru">
          🛠️ 설문지를 준비 중입니다...
        </Typography>
      </Stack>
    );

  const shareData = data?.data;

  if (!shareData) return <Notfound comment="공유되지 않은 설문입니다." />;
  if (shareData && shareData.deletedAt !== null)
    return <Notfound comment="공유 정지된 설문입니다." />;

  return (
    <Stack gap={5}>
      <Alert>
        <AlertTitle>안내</AlertTitle>
        <Typography gutterBottom>
          SnapPoll에서 제공하는 공개 설문지입니다.
          {user && (
            <Typography component="span" gutterBottom>
              {' '}
              {user?.username}님의 계정 정보로 응답이 제출됩니다.
            </Typography>
          )}
        </Typography>

        <Button component={Link} size="small" variant="contained" to="/">
          사이트 보러가기
        </Button>
      </Alert>
      <Stack>
        <DetailPollPage pollId={shareData.pollId} refetchShare={refetchShare} />
      </Stack>
      <Chip
        label="shared by SnapPoll"
        size="small"
        sx={{ position: 'fixed', bottom: 10, right: 10 }}
      />
    </Stack>
  );
};

export default SharePoll;
