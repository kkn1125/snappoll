import { getPolls } from '@/apis/getPolls';
import { BRAND_NAME } from '@common/variables';
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const query = useQuery<APIPoll[]>({
    queryKey: ['polls'],
    queryFn: getPollList,
  });

  function getPollList() {
    return getPolls();
  }

  return (
    <Stack gap={5}>
      {/* first section */}
      <Stack gap={2}>
        <Typography align="center" fontSize={36} fontWeight={700}>
          모두의 설문 조사
        </Typography>
        <Typography
          className="font-maru"
          align="center"
          fontSize={18}
          fontWeight={300}
        >
          자유롭게 묻고 답하고 투표하는{' '}
          <Typography component="span" className="font-monts" fontWeight={700}>
            {BRAND_NAME}
          </Typography>
        </Typography>
      </Stack>
      {/* second section */}
      <Stack gap={2}>
        <Typography align="center" fontSize={36} fontWeight={700}>
          최근 설문조사
        </Typography>
        <Paper>
          <List>
            {query.data?.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => {
                  navigate('/polls/' + item.id);
                }}
              >
                <ListItemText>{item.title}</ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default Home;
