import { sendConfirmMail } from '@/apis/panel/sendConfirmMail';
import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

interface PanelHeaderProps {}
const PanelHeader: React.FC<PanelHeaderProps> = () => {
  const {user} = useToken('admin')
  const { openModal } = useModal();

  const sendConfirmMailMutation = useMutation({
    mutationKey: ['sendConfirmMail'],
    mutationFn: sendConfirmMail,
  });

  function handleSendMail() {
    sendConfirmMailMutation.mutate();
  }

  function openLoginModal() {
    openModal({
      info: { title: '안내', content: '관리자 메일 인증을 진행합니다.' },
      slot: (
        <Stack>
          <Button
            startIcon={
              sendConfirmMailMutation.isPending && (
                <CircularProgress size={16} />
              )
            }
            onClick={handleSendMail}
          >
            보내기
          </Button>
        </Stack>
      ),
    });
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      px={5}
      sx={{ borderBottom: '1px solid #ccc' }}
    >
      <Typography fontSize={20}>BackOffice</Typography>
      <Stack direction="row" gap={2}>
        <Button onClick={openLoginModal}>Login</Button>
      </Stack>
    </Stack>
  );
};

export default PanelHeader;
