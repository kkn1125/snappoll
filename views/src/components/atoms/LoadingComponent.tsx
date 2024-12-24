import { Stack, Typography } from '@mui/material';
import { InitialValue } from '@providers/contexts/loadingTypes';
import { memo } from 'react';
import LoadingAnimationPoll from './LoadingAnimationPoll';
import LoadingAnimationVote from './LoadingAnimationVote';

interface LoadingComponentProps {
  state: InitialValue;
}
const LoadingComponent: React.FC<LoadingComponentProps> = ({ state }) => {
  if (!state.loading) return <></>;

  return (
    <Stack
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      justifyContent="center"
      alignItems="center"
      sx={{
        zIndex: 1500,
        backgroundColor: '#ffffffff',
        backdropFilter: 'blur(1px)',
        opacity: state.close ? 0 : 1,
        transition: `opacity ${state.close ? 0.5 : state.timeout}s ease-in-out`,
      }}
    >
      {state.content === 'poll' && <LoadingAnimationPoll />}
      {state.content === 'vote' && <LoadingAnimationVote />}
      <Typography sx={{ mt: 1 }}>Loading...</Typography>
    </Stack>
  );
};

export default memo(LoadingComponent);
