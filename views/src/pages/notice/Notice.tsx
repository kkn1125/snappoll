import { messageAtom } from '@/recoils/message.atom';
import { tokenAtom } from '@/recoils/token.atom';
import ReadyAlert from '@components/atoms/ReadyAlert';
import useSocket from '@hooks/useSocket';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

interface NoticeProps {}
const Notice: React.FC<NoticeProps> = () => {
  const { user } = useRecoilValue(tokenAtom);
  const { receiver } = useRecoilValue(messageAtom);
  const [page, setPage] = useState(1);

  const { getMessages, messageRead, messageAllRead } = useSocket();

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

  const handleReaded = (messageId: string) => {
    messageRead(messageId);
  };

  const handleAllReaded = (messageIds: string[]) => {
    messageAllRead(messageIds);
  };

  const handleChangePage = useCallback(
    (e: ChangeEvent<unknown>, page: number) => {
      setPage(page);
    },
    [],
  );

  return (
    <Stack alignItems="center" justifyContent="center">
      <ReadyAlert />
    </Stack>
  );

  return (
    <Container>
      <Toolbar />
      <Typography fontSize={32} fontWeight={700} gutterBottom>
        알림
      </Typography>
      <Paper>
        <Stack minHeight={100} p={3}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => {
                handleAllReaded(receiver.map((message) => message.id));
              }}
            >
              모두 읽음
            </Button>
          </Stack>
          <List>
            {receiver.map((message) => (
              <ListItem
                key={message.id}
                disablePadding
                secondaryAction={
                  !message.checked && (
                    <Button
                      variant="contained"
                      onClick={() => handleReaded(message.id)}
                    >
                      읽음
                    </Button>
                  )
                }
              >
                <ListItemButton>
                  <ListItemText>{message.message}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            {receiver.length === 0 && (
              <ListItem>
                <Typography>받은 알림이 없습니다.</Typography>
              </ListItem>
            )}
          </List>
          <Stack alignItems="center">
            <Pagination
              page={page}
              onChange={handleChangePage}
              showFirstButton
              showLastButton
              count={Math.ceil(receiver.length / 10)}
            />
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Notice;
