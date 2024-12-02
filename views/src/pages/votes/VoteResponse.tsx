import ReadyAlert from '@components/atoms/ReadyAlert';
import { Stack } from '@mui/material';

interface VoteResponseProps {}
const VoteResponse: React.FC<VoteResponseProps> = () => {
  return (
    <Stack direction="row" justifyContent="center" alignContent="center">
      <ReadyAlert />
    </Stack>
  );
};

export default VoteResponse;
