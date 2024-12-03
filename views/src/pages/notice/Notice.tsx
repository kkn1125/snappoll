import { messageAtom } from '@/recoils/message.atom';
import useSocket from '@hooks/useSocket';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';

interface NoticeProps {}
const Notice: React.FC<NoticeProps> = () => {
  const { receiver } = useRecoilValue(messageAtom);
  const { messageRead } = useSocket();

  const handleReaded = useCallback((messageId: string) => {
    messageRead(messageId);
  }, []);

  return (
    <Container>
      <Toolbar />
      <Typography>알림</Typography>
      <Paper>
        <Stack minHeight={100} p={3}>
          <List>
            {receiver.map((message) => (
              <ListItem
                key={message.id}
                disablePadding
                secondaryAction={
                  <Button onClick={() => handleReaded(message.id)}>
                    {!message.checked && '읽음'}
                  </Button>
                }
              >
                <ListItemButton>
                  <ListItemText>{message.message}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Notice;
