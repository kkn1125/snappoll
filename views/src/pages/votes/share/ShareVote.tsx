import { getShareVote } from '@/apis/vote/share/getShareVote';
import { SnapShareVote } from '@models/SnapShareVote';
import Notfound from '@pages/Notfound';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import DetailVote from '../DetailVote';

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
  return <DetailVote voteId={query.data.voteId} refetchShare={refetchShare} />;
};

export default ShareVote;
