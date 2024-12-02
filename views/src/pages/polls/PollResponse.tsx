import { getPollResponse } from '@/apis/poll/response/getPollResponse';
import { tokenAtom } from '@/recoils/token.atom';
import { SnapResponse } from '@models/SnapResponse';
import {
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface PollResponseProps {}
const PollResponse: React.FC<PollResponseProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useQuery<SnapResponse[]>({
    queryKey: ['pollResponses'],
    queryFn: () => getPollResponse(id),
  });

  const getTitle = useCallback((response: SnapResponse) => {
    return response.poll?.title;
  }, []);

  const getUser = useCallback(
    (response: SnapResponse) => {
      return response.user
        ? response.user.username === user?.username
          ? '나'
          : response.user.username
        : 'Unknown';
    },
    [user?.username],
  );

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        <List>
          {data?.map((response, i) => (
            <ListItem key={response.id}>
              <ListItemButton
                onClick={() => navigate(`/polls/${id}/response/${response.id}`)}
              >
                <ListItemText>{i + 1}.</ListItemText>
                <ListItemText>{getTitle(response)}</ListItemText>
                <ListItemText>{getUser(response)}</ListItemText>
                <ListItemText>
                  {dayjs(response.createdAt).format('YYYY. MM. DD. HH:mm')}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
          {data?.length === 0 && (
            <ListItem>
              <ListItemButton>
                <ListItemText>
                  아직 설문조사에 참여한 사람이 없습니다.
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        <Button
          variant="contained"
          size="large"
          type="button"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          이전으로
        </Button>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default PollResponse;
