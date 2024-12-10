import { getMyVotes } from '@/apis/vote/getMyVotes';
import SkeletonGraphList from '@components/moleculars/SkeletonGraphList';
import { SnapVote } from '@models/SnapVote';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VoteGraphListProps {}
const VoteGraphList: React.FC<VoteGraphListProps> = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const myVotes = useQuery<{ votes: SnapVote[]; count: number }>({
    queryKey: ['my-votes', page],
    queryFn: getMyVotes,
  });
  const handleRedirect = (to: string) => {
    navigate(`/graph/votes/${to}`);
  };

  const totalPage = useMemo(() => {
    const count = myVotes.data?.count || 0;
    return Math.ceil(count / 10);
  }, [myVotes.data?.count]);

  if (myVotes.isLoading) return <SkeletonGraphList />;

  return (
    <Stack>
      <List>
        {myVotes.data?.votes.map((vote) => (
          <ListItem key={vote.id}>
            <ListItemButton
              onClick={() => handleRedirect(vote.id)}
              sx={{ display: 'flex', gap: 2.5 }}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
                width={50}
                minWidth={50}
                height={50}
                minHeight={50}
                sx={{
                  borderRadius: '100%',
                  boxShadow: '3px 3px 5px 0 #00000056',
                }}
              >
                <BarChartIcon color="success" fontSize="large" />
              </Stack>
              <ListItemText
                primary={vote.title}
                secondary={`작성자: ${vote.user?.username} | 생성일: ${new Date(vote.createdAt).toLocaleDateString()}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {myVotes.data?.count === 0 && (
          <ListItem>
            <ListItemText>데이터가 없습니다.</ListItemText>
          </ListItem>
        )}
      </List>
      <Stack alignItems="center">
        <Pagination page={page} count={totalPage} />
      </Stack>
    </Stack>
  );
};

export default VoteGraphList;
