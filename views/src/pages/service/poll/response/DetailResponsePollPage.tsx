import { getResponse } from '@/apis/poll/response/getResponse';
import { tokenAtom } from '@/recoils/token.atom';
import PollResponseLayout from '@components/templates/PollResponseLayout';
import { SnapResponse } from '@models/SnapResponse';
import { Button, Divider, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface DetailResponsePollPageProps {}
const DetailResponsePollPage: React.FC<DetailResponsePollPageProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const { responseId: id } = useParams();
  const { data } = useQuery<SnapResponseType<SnapResponse>>({
    queryKey: ['pollResponse', id],
    queryFn: () => getResponse(id),
  });
  const responseData = data?.data;

  return (
    <Stack gap={3}>
      {responseData?.poll && (
        <PollResponseLayout
          poll={responseData.poll}
          contributor={
            responseData.user
              ? responseData.user.username === user?.username
                ? '나'
                : responseData.user.username
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
  );
};

export default DetailResponsePollPage;
