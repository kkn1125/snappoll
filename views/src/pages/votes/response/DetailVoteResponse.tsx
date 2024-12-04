import { getResponse } from '@/apis/poll/response/getResponse';
import { tokenAtom } from '@/recoils/token.atom';
import VoteResponseLayout from '@components/templates/VoteResponseLayout';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { Button, Container, Divider, Stack, Toolbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface DetailVoteResponseProps {}
const DetailVoteResponse: React.FC<DetailVoteResponseProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const { responseId: id } = useParams();
  const { data } = useQuery<SnapVoteResponse>({
    queryKey: ['voteResponse'],
    queryFn: () => getResponse(id),
  });

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        {data?.vote && (
          <VoteResponseLayout
            vote={data.vote}
            answer={data.voteAnswer}
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

export default DetailVoteResponse;
