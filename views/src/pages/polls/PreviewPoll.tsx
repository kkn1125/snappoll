import PollLayout from '@components/templates/PollLayout';
import { Button, Container, Stack } from '@mui/material';
import { Poll } from '@utils/Poll';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface PreviewPollProps {}
const PreviewPoll: React.FC<PreviewPollProps> = () => {
  const [polls, setPolls] = useState<Poll<PollType['type']>[]>([]);

  const navigate = useNavigate();
  const locate = useLocation();

  useEffect(() => {
    if (locate.state.data) {
      setPolls(JSON.parse(locate.state.data.options));
    }
  }, [locate.state.data]);

  return (
    <Container component={Stack} gap={3}>
      <PollLayout
        data={locate.state.data as APIPoll}
        polls={polls}
        setPolls={setPolls}
      />
      <Button
        onClick={() => {
          navigate('/polls/new', { state: { data: locate.state.data } });
        }}
      >
        돌아가기
      </Button>
    </Container>
  );
};

export default PreviewPoll;
