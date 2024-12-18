import { Box, keyframes, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface LoadingAnimationPollProps {}
const LoadingAnimationPoll: React.FC<LoadingAnimationPollProps> = () => {
  const [loaded, setLoaded] = useState(false);
  const [wroteText, setWroteText] = useState(false);

  useEffect(() => {
    setLoaded(true);

    let interval: NodeJS.Timeout;

    // setWroteText(true);
    setTimeout(() => {
      setWroteText(true);
      setTimeout(() => {
        setWroteText(false);
      }, 1500);
      interval = setInterval(() => {
        setWroteText(true);
        setTimeout(() => {
          setWroteText(false);
        }, 1000);
      }, 3000);
    }, 500);

    return () => {
      clearInterval(interval);
      setWroteText(false);
      setLoaded(false);
    };
  }, []);

  const writeAnimation = keyframes`
    0%  {
      opacity: 0;
      top:    0px;
      right:  0px;
      -webkit-transform: translateX(0%);
              transform: translateX(0%);
      -webkit-transform-origin: 50% 50%;
              transform-origin: 50% 50%;
    }
    15% {
      opacity: 1;
      -webkit-transform: translateX(-30px) rotate(6deg);
              transform: translateX(-30px) rotate(6deg);
    }
    30% {
      -webkit-transform: translateX(15px) rotate(-6deg);
              transform: translateX(15px) rotate(-6deg);
    }
    45% {
      -webkit-transform: translateX(-15px) rotate(3.6deg);
              transform: translateX(-15px) rotate(3.6deg);
    }
    60% {
      -webkit-transform: translateX(9px) rotate(-2.4deg);
              transform: translateX(9px) rotate(-2.4deg);
    }
    75% {
      opacity: 1;
      -webkit-transform: translateX(-6px) rotate(1.2deg);
              transform: translateX(-6px) rotate(1.2deg);
    }
    100% {
      opacity: 0;
      top:    80px;
      right:  60px;
      -webkit-transform: translateX(0%);
              transform: translateX(0%);
      -webkit-transform-origin: 50% 50%;
              transform-origin: 50% 50%;
    }
  `;

  const wroteTextAnimation = keyframes`
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  `;

  return (
    <Stack position="relative">
      {/* paper */}
      <Box
        component={Paper}
        elevation={3}
        width={120}
        height={120 * (297 / 210)}
        sx={{
          rotate: '5deg',
          position: 'relative',
          p: 2,
          ['&::before']: {
            content: '""',
            background: `repeating-linear-gradient(
              0deg, /* 45도 각도로 변경 */
              #ccc,
              #ccc 2px,
              transparent 2px,
              transparent 15px
            );`,
            width: '100%',
            height: '100%',
            display: 'block',
            opacity: 0,
            zIndex: 100,
            animation: wroteText
              ? `${wroteTextAnimation} 1s linear both`
              : 'none',
          },
        }}
      />

      {/* pen */}
      <Box
        component={Paper}
        elevation={2}
        width={10}
        height={70}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          rotate: '45deg',
          background: '#ffffff',
          boxShadow: 'var(--Paper-shadow), inset 0 0 0 9999999px #eee',
          animation: loaded
            ? `${writeAnimation} 3s ease-in-out both infinite`
            : 'none',
        }}
      />
    </Stack>
  );
};

export default LoadingAnimationPoll;
