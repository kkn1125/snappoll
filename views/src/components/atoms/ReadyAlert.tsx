import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Typography } from '@mui/material';

interface ReadyAlertProps {}
const ReadyAlert: React.FC<ReadyAlertProps> = () => {
  return (
    <Typography
      fontSize={32}
      fontWeight={700}
      sx={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        top: '50%',
        left: '50%',
        whiteSpace: 'nowrap',
        transform: 'translate(-50%, -50%)',
        ['& .MuiSvgIcon-root']: {
          transition: 'all 150ms ease-in-out',
        },
        ['&:hover .MuiSvgIcon-root']: {
          filter: 'drop-shadow(0 0 8px #ed6c02)',
        },
      }}
    >
      <LightbulbIcon color="warning" sx={{ fontSize: 32 }} />
      준비 중 입니다.
    </Typography>
  );
};

export default ReadyAlert;
