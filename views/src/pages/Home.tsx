import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

const Home = () => {
  return (
    <Stack gap={3}>
      {/* first section */}
      <Typography align="center" fontSize={36} fontWeight={700}>
        Realtime Poll
      </Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText>test</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Stack>
  );
};

export default Home;
