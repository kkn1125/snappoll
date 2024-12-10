import { getSharePoll } from '@/apis/poll/share/getSharePoll';
import { SnapSharePoll } from '@models/SnapSharePoll';
import Notfound from '@pages/Notfound';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import DetailPoll from '../DetailPoll';

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

  if (!query.data) return <Notfound comment="공유되지 않은 설문입니다." />;
  if (query.data && query.data.deletedAt !== null)
    return <Notfound comment="공유 정지된 설문입니다." />;
  return <DetailPoll pollId={query.data.pollId} refetchShare={refetchShare} />;
};

export default SharePoll;
