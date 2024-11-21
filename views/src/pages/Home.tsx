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
    <Stack>
      <Typography>title 1</Typography>
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
