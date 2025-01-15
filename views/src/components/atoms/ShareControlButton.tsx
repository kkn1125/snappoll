import { createSharePoll } from '@apis/poll/share/createSharePoll';
import { resumeShareUrl as resumeSharePollUrl } from '@apis/poll/share/resumeShareUrl';
import { revokeShareUrl as revokeSharePollUrl } from '@apis/poll/share/revokeShareUrl';
import { createShareVote } from '@apis/vote/share/createShareVote';
import { resumeShareUrl as resumeShareVoteUrl } from '@apis/vote/share/resumeShareUrl';
import { revokeShareUrl as revokeShareVoteUrl } from '@apis/vote/share/revokeShareUrl';
import { Message } from '@common/messages';
import { BASE_CLIENT_URL } from '@common/variables';
import useModal from '@hooks/useModal';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import QR from 'qrcode';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

interface ShareControlButtonProps {
  data?: SnapPoll | SnapVote;
  user?: Pick<User, 'id' | 'email' | 'username' | 'userProfile'>;
  refetch: () => void;
}
const ShareControlButton: React.FC<ShareControlButtonProps> = ({
  data,
  user,
  refetch,
}) => {
  const [copy, setCopy] = useState(false);
  const [copyQr, setCopyQr] = useState(false);
  const [createPublicUrl, setCreatePublicUrl] = useState(false);
  const { openModal } = useModal();
  const name = data ? ('sharePoll' in data ? 'poll' : 'vote') : undefined;
  const share = data
    ? 'sharePoll' in data
      ? (data as SnapPoll).sharePoll
      : (data as SnapVote).shareVote
    : undefined;

  const handleCopyUrl = useCallback(() => {
    if (share) {
      navigator.clipboard
        .writeText(
          `${BASE_CLIENT_URL}/service/${name}/share/?url=${encodeURIComponent(share.url)}`,
        )
        .then(() => {
          setCopy(true);
          setTimeout(() => {
            setCopy(false);
          }, 3000);
        });
    }
  }, [name, share]);

  const createPublicUrlMutation = useMutation({
    mutationKey: ['createPublicUrl'],
    mutationFn: name === 'poll' ? createSharePoll : createShareVote,
    onSuccess(data, variables, context) {
      if (data) {
        openModal({ info: Message.Info.CreateShareUrl });
        refetch();
        setTimeout(() => {
          setCreatePublicUrl(false);
        }, 3000);
      }
    },
  });

  const resumePublicUrlMutation = useMutation({
    mutationKey: ['resumePublicUrl'],
    mutationFn: name === 'poll' ? resumeSharePollUrl : resumeShareVoteUrl,
    onSuccess(data, variables, context) {
      if (data) {
        openModal({ info: Message.Info.ResumeShareUrl });
        refetch();
        setTimeout(() => {
          setCreatePublicUrl(false);
        }, 3000);
      }
    },
  });

  const revokePublicUrlMutation = useMutation({
    mutationKey: ['revokePublicUrl'],
    mutationFn: name === 'poll' ? revokeSharePollUrl : revokeShareVoteUrl,
    onSuccess(data, variables, context) {
      if (data) {
        openModal({ info: Message.Info.RevokeShareUrl });
        refetch();
        setTimeout(() => {
          setCreatePublicUrl(false);
        }, 3000);
      }
    },
  });

  const handleCreatePublicUrl = useCallback((pollId: string) => {
    setCreatePublicUrl(true);
    createPublicUrlMutation.mutate(pollId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResumePublicUrl = useCallback((id: string) => {
    resumePublicUrlMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRevokePublicUrl = useCallback((id: string) => {
    revokePublicUrlMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCopyQrCodeImage() {
    setCopyQr(true);
    if (share) {
      const qrCodeUrl = `${BASE_CLIENT_URL}/service/${name}/share/?url=${encodeURIComponent(share.url)}`;
      QR.toDataURL(qrCodeUrl).then((url) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(image, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item]).then(() => {
                openModal({
                  info: { title: '안내', content: 'QR 코드가 복사되었습니다.' },
                  closeCallback: () => {
                    image.remove();
                    URL.revokeObjectURL(url);
                    setCopyQr(false);
                  },
                });
              });
            }
          }, 'image/png');
        };
      });
    }
  }

  if (!data || !user || data.user?.id !== user.id) return <></>;

  return (
    user.id === data.user.id &&
    (!share ? (
      <Stack>
        <Button
          size="small"
          startIcon={createPublicUrl ? <CheckCircleIcon /> : <ShareIcon />}
          onClick={() => handleCreatePublicUrl(data.id)}
        >
          공유 URL 생성하기
        </Button>
      </Stack>
    ) : share.deletedAt !== null ? (
      <Button
        color="warning"
        size="small"
        onClick={() => handleResumePublicUrl(share.id)}
      >
        공유 URL 복구하기
      </Button>
    ) : (
      <Stack direction="column" alignItems="flex-end" gap={1}>
        {share.url && (
          <Button
            component={Link}
            color="info"
            size="small"
            to={`${BASE_CLIENT_URL}/service/${name}/share/?url=${encodeURIComponent(share.url)}`}
            target="_blank"
          >
            공유 {name === 'poll' ? '설문' : '투표'} 확인하기
          </Button>
        )}

        {share.url && (
          <Button
            size="small"
            color={copyQr ? 'success' : 'inherit'}
            startIcon={copyQr ? <CheckCircleIcon /> : <ContentCopyIcon />}
            onClick={handleCopyQrCodeImage}
          >
            공유 QR코드 복사
          </Button>
        )}

        <Button
          color={copy ? 'success' : 'inherit'}
          size="small"
          startIcon={copy ? <CheckCircleIcon /> : <LinkIcon />}
          onClick={handleCopyUrl}
        >
          공유 URL 복사
        </Button>
        <Button
          color="error"
          size="small"
          onClick={() => handleRevokePublicUrl(share.id)}
        >
          공유 URL 정지하기
        </Button>
      </Stack>
    ))
  );
};

export default ShareControlButton;
