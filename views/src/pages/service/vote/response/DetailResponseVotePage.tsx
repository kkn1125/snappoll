import { getResponse } from '@/apis/vote/response/getResponse';
import { tokenAtom } from '@/recoils/token.atom';
import { UnknownName } from '@common/variables';
import VoteResponseLayout from '@components/templates/VoteResponseLayout';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUsernameOr } from '@utils/getUsernameOr';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface DetailResponseVotePageProps {}
const DetailResponseVotePage: React.FC<DetailResponseVotePageProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const { responseId: id } = useParams();
  const { data } = useQuery<SnapResponseType<SnapVoteResponse>>({
    queryKey: ['voteResponse'],
    queryFn: () => getResponse(id),
  });
  const responseData = data?.data;
  const username = getUsernameOr(responseData?.user?.username);

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        {responseData?.vote && (
          <VoteResponseLayout
            vote={responseData.vote}
            answer={responseData.voteAnswer}
            contributor={username === user?.username ? '나' : username}
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

export default DetailResponseVotePage;
