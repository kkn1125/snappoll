import { tokenAtom } from '@/recoils/token.atom';
import VoteOptionItem from '@components/atoms/VoteOptionItem';
import { SnapVote } from '@models/SnapVote';
import { Stack, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';

interface VoteLayoutProps {
  vote: SnapVote;
}
const VoteLayout: React.FC<VoteLayoutProps> = ({ vote }) => {
  const { user } = useRecoilValue(tokenAtom);

  return (
    <Stack gap={1}>
      <Stack justifyContent="baseline" gap={1}>
        <Typography
          className="font-maru"
          fontSize={32}
          fontWeight={700}
          align="center"
          gutterBottom
        >
          {vote.title}
        </Typography>
        <Stack alignItems="flex-end" mb={1} flex={1} gap={1}>
          <Typography className="font-maru" fontSize={16} fontWeight={100}>
            {user?.username}
          </Typography>

          <Typography className="font-maru" fontSize={16}>
            {(vote.expiresAt &&
              dayjs(vote.expiresAt).format('YYYY. MM. DD HH:mm') + ' 까지') ||
              ''}
          </Typography>
        </Stack>
      </Stack>

      <Toolbar />

      {vote.description && (
        <Typography
          className="font-maru"
          fontSize={14}
          fontWeight={300}
          sx={{
            p: 3,
            backgroundColor: grey['100'],
            borderRadius: 1,
            // borderTopRightRadius: 1,
            // borderBottomRightRadius: 1,
            borderLeft: '5px solid #aaa',
          }}
        >
          {vote.description}
        </Typography>
      )}

      <Toolbar />

      <Stack direction="row" gap={3} flexWrap="wrap">
        {vote.voteOption.map((option) => (
          <VoteOptionItem key={option.id} option={option} />
        ))}
      </Stack>
    </Stack>
  );
};

export default VoteLayout;
