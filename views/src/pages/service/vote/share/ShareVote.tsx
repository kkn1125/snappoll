import { getShareVote } from '@apis/vote/share/getShareVote';
import useToken from '@hooks/useToken';
import { SnapShareVote } from '@models/SnapShareVote';
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import Notfound from '@pages/NotfoundPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import DetailVotePage from '../DetailVotePage';

interface ShareVoteProps {
  url: string;
}
const ShareVote: React.FC<ShareVoteProps> = ({ url }) => {
  const queryClient = useQueryClient();
  const { user } = useToken();
  const { data, isLoading } = useQuery<SnapResponseType<SnapShareVote>>({
    queryKey: ['shareVote', url],
    queryFn: () => getShareVote(url),
  });
  const refetchShare = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['shareVote'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareData = data?.data;

  if (!shareData) return <Notfound comment="공유되지 않은 투표입니다." />;
  if (shareData && shareData.deletedAt !== null)
    return <Notfound comment="공유 정지된 투표입니다." />;

  if (isLoading)
    return (
      <Stack justifyContent="center" alignItems="center" height="inherit">
        <Typography variant="h3" fontWeight={700} className="font-maru">
          🛠️ 투표지를 준비 중입니다...
        </Typography>
      </Stack>
    );

  return (
    <Stack gap={5}>
      <Alert>
        <AlertTitle>안내</AlertTitle>
        <Typography gutterBottom>
          SnapPoll에서 제공하는 공개 투표지입니다.
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
        <DetailVotePage voteId={shareData.voteId} refetchShare={refetchShare} />
      </Stack>
      <Chip
        label="shared by SnapPoll"
        size="small"
        sx={{ position: 'fixed', bottom: 10, right: 10 }}
      />
    </Stack>
  );
};

export default ShareVote;
