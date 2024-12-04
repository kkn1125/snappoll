import { getResponse } from '@/apis/poll/response/getResponse';
import { tokenAtom } from '@/recoils/token.atom';
import PollResponseLayout from '@components/templates/PollResponseLayout';
import { SnapResponse } from '@models/SnapResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface DetailPollResponseProps {}
const DetailPollResponse: React.FC<DetailPollResponseProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const { responseId: id } = useParams();
  const { data } = useQuery<SnapResponse>({
    queryKey: ['pollResponse', id],
    queryFn: () => getResponse(id),
  });

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        {data?.poll && (
          <PollResponseLayout
            poll={data.poll}
            contributor={
              data.user
                ? data.user.username === user?.username
                  ? '나'
                  : data.user.username
                : 'Unknown'
            }
          />
        )}
        <Divider />
        <Button
          variant="contained"
          size="large"
          type="button"
          color="inherit"
          onClick={() => {
            history.back();
          }}
        >
          이전으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default DetailPollResponse;
