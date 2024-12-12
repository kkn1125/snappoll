import { getSharePoll } from '@/apis/poll/share/getSharePoll';
import { SnapSharePoll } from '@models/SnapSharePoll';
import Notfound from '@pages/NotfoundPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import DetailPoll from '../DetailPollPage';
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface SharePollProps {
  url: string;
}
const SharePoll: React.FC<SharePollProps> = ({ url }) => {
  const queryClient = useQueryClient();
  const query = useQuery<SnapSharePoll>({
    queryKey: ['sharePoll', url],
    queryFn: () => getSharePoll(url),
  });
  const refetchShare = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['sharePoll'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (query.isLoading)
    return (
      <Stack justifyContent="center" alignItems="center" height="inherit">
        <Typography variant="h3" fontWeight={700} className="font-maru">
          🛠️ 설문지를 준비 중입니다...
        </Typography>
      </Stack>
    );

  if (!query.data) return <Notfound comment="공유되지 않은 설문입니다." />;
  if (query.data && query.data.deletedAt !== null)
    return <Notfound comment="공유 정지된 설문입니다." />;

  return (
    <Container maxWidth="md">
      <Alert>
        <AlertTitle>안내</AlertTitle>
        <Typography gutterBottom>
          SnapPoll에서 제공하는 공개 설문지입니다.
        </Typography>
        <Button component={Link} size="small" variant="contained" to="/">
          사이트로 보러가기
        </Button>
      </Alert>
      <Stack>
        <DetailPoll pollId={query.data.pollId} refetchShare={refetchShare} />
      </Stack>
    </Container>
  );
};

export default SharePoll;
