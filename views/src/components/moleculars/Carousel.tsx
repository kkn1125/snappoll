import { Box, Fade, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

interface CarouselProps {
  slots: React.ReactElement[];
  delay?: number;
}
const Carousel: React.FC<CarouselProps> = ({ slots, delay = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    let time1: NodeJS.Timeout, time2: NodeJS.Timeout;

    // eslint-disable-next-line prefer-const
    time1 = setTimeout(() => {
      setShow(false);
      time2 = setTimeout(() => {
        setIndex((index) => (index + 1) % slots.length);
      }, 1000);
    }, delay);
    return () => {
      clearTimeout(time1);
      clearTimeout(time2);
    };
  }, [delay, index, slots.length]);

  const item = useMemo(() => {
    return slots[index];
  }, [index, slots]);

  return (
    <Stack direction="row" justifyContent="center" mx="auto">
      {item && (
        <Fade in={show}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            flex={1}
            position="relative"
            mx="auto"
            gap={3}
          >
            {item}
          </Stack>
        </Fade>
      )}
    </Stack>
  );
};

export default Carousel;
