import { Box, keyframes, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface LoadingAnimationVoteProps {}
const LoadingAnimationVote: React.FC<LoadingAnimationVoteProps> = () => {
  const [loaded, setLoaded] = useState(false);
  const [shake, setShake] = useState(false);
  const shakeBottom = keyframes`
    0%,
    100% {
      -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
      -webkit-transform-origin: 50% 100%;
              transform-origin: 50% 100%;
    }
    10% {
      -webkit-transform: rotate(2deg);
              transform: rotate(2deg);
    }
    20%,
    40%,
    60% {
      -webkit-transform: rotate(-4deg);
              transform: rotate(-4deg);
    }
    30%,
    50%,
    70% {
      -webkit-transform: rotate(4deg);
              transform: rotate(4deg);
    }
    80% {
      -webkit-transform: rotate(-2deg);
              transform: rotate(-2deg);
    }
    90% {
      -webkit-transform: rotate(2deg);
              transform: rotate(2deg);
    }
  `;
  const fallingAnimation = keyframes`
    0%   {
      opacity: 0;
      top: -300%;
      transform: rotate(360deg);
      z-index: 1;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 0;
      top: -10%;
      transform: rotate(0deg);
    }
    90% {
      opacity: 0;
      top: -0%;
      transform: rotate(0deg);
    }
    100% {
      opacity: 0;
      top: 0%;
      transform: rotate(0deg);
    }
  `;

  useEffect(() => {
    setLoaded(true);
    const timeout = setInterval(() => {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 1000);
    }, 3000);
    return () => {
      clearInterval(timeout);
      setLoaded(false);
    };
  }, []);

  return (
    <Stack alignItems="center" sx={{ position: 'relative' }}>
      {/* box */}
      <Box
        component={Paper}
        elevation={3}
        sx={{
          position: 'relative',
          width: 100,
          height: 70,
          backgroundColor: '#ffffff',
          boxShadow: (theme) =>
            `var(--Paper-shadow), inset 0 0 0 9999999px ${
              shake ? theme.palette.success.light + 56 : '#ddd'
            }`,
          transform: 'rotateX(-5deg)',
          zIndex: 10,
          animation: shake
            ? `${shakeBottom} 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both`
            : 'none',
        }}
      />
      {/* paper */}
      <Box
        component={Paper}
        elevation={3}
        sx={{
          position: 'relative',
          top: '-300%',
          width: 30,
          height: 20,
          opacity: 0,
          backgroundColor: '#fff',
          animation: loaded
            ? `${fallingAnimation} 3s linear both infinite`
            : 'none',
          zIndex: 9,
        }}
      />
    </Stack>
  );
};

export default LoadingAnimationVote;
