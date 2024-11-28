import { Typography } from '@mui/material';

interface ReadyAlertProps {}
const ReadyAlert: React.FC<ReadyAlertProps> = () => {
  return (
    <Typography
      fontSize={32}
      fontWeight={700}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      준비 중 입니다.
    </Typography>
  );
};

export default ReadyAlert;
