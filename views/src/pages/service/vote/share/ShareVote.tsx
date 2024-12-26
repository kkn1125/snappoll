import { getShareVote } from '@apis/vote/share/getShareVote';
import { SnapShareVote } from '@models/SnapShareVote';
import Notfound from '@pages/NotfoundPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import DetailVote from '../DetailVotePage';
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface ShareVoteProps {
  url: string;
}
const ShareVote: React.FC<ShareVoteProps> = ({ url }) => {
  const queryClient = useQueryClient();
  const query = useQuery<SnapShareVote>({
    queryKey: ['shareVote', url],
    queryFn: () => getShareVote(url),
  });
  const refetchShare = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['shareVote'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!query.data) return <Notfound comment="공유되지 않은 투표입니다." />;
  if (query.data && query.data.deletedAt !== null)
    return <Notfound comment="공유 정지된 투표입니다." />;

  if (query.isLoading)
    return (
      <Stack justifyContent="center" alignItems="center" height="inherit">
        <Typography variant="h3" fontWeight={700} className="font-maru">
          🛠️ 투표지를 준비 중입니다...
        </Typography>
      </Stack>
    );

  return (
    <Container maxWidth="md">
      <Alert>
        <AlertTitle>안내</AlertTitle>
        <Typography gutterBottom>
          SnapPoll에서 제공하는 공개 투표지입니다.
        </Typography>
        <Button component={Link} size="small" variant="contained" to="/">
          사이트로 보러가기
        </Button>
      </Alert>
      <Stack>
        <DetailVote voteId={query.data.voteId} refetchShare={refetchShare} />
      </Stack>
      <Chip
        label="shared by SnapPoll"
        size="small"
        sx={{ position: 'fixed', bottom: 10, right: 10 }}
      />
    </Container>
  );
};

export default ShareVote;
