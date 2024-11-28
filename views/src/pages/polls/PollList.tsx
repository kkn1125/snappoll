import { getPolls } from '@/apis/getPolls';
import PollLayout from '@components/templates/PollLayout';
import {
  Box,
  Button,
  Container,
  Fade,
  Stack,
  Typography,
  Zoom,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface PollListProps {}
const PollList: React.FC<PollListProps> = () => {
  // const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(-1);
  const pollListMutate = useMutation({
    mutationKey: ['pollList'],
    mutationFn: getPolls,
    onSuccess(data, variables, context) {
      console.log(data);
    },
  });

  useEffect(() => {
    pollListMutate.mutate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleIndexToggle(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const closest = target.closest('.preview-entry') as HTMLElement;
      const previewActive = target.closest('#preview-active');
      if (previewActive || closest) {
        if (closest) {
          setIndex(+(closest.dataset.index || -1));
        }
      } else {
        setIndex(-1);
      }
    }

    window.addEventListener('click', handleIndexToggle);
    return () => {
      window.removeEventListener('click', handleIndexToggle);
    };
  }, []);

  // function handleHoverPoll(idx: number) {
  //   setHovered(true);
  //   setIndex(idx);
  // }

  const previewOptions = useMemo(() => {
    return pollListMutate.data?.[index]?.options
      ? JSON.parse(pollListMutate.data?.[index]?.options)
      : [];
  }, [index, pollListMutate.data]);

  const scale = 0.5;

  return (
    <Stack height="inherit" flex={1} pb={5}>
      <Container component={Stack} flex={1}>
        <Box
          id="preview-active"
          position="relative"
          minHeight={'50vh'}
          overflow="hidden"
          mb={8}
          sx={{ boxShadow: 'inset 0 0 1rem 1rem #ffffff' }}
        >
          <Fade in={index > -1} timeout={{ enter: 1000, exit: 500 }}>
            <Button
              component={Link}
              variant="contained"
              to={
                index > -1 ? `/polls/${pollListMutate?.data?.[index]?.id}` : ''
              }
              sx={{
                position: 'absolute',
                left: '50%',
                bottom: 100,
                transform: 'translateX(-50%)',
              }}
            >
              설문 참여
            </Button>
          </Fade>
          <Box
            position="absolute"
            width={{ xs: `calc(90% / ${scale})`, md: `calc(80% / ${scale})` }}
            overflow="hidden"
            left={{
              xs: `calc(50% - (90% * ${1 - scale}))`,
              md: `calc(50% - (80% * ${1 - scale}))`,
            }}
            pt={5}
            px={5}
            height="100vh"
            sx={{
              zIndex: -1,
              backgroundColor: 'white',
              borderTop: '1px solid #eee',
              borderInline: '1px solid #eee',
              boxShadow: '0 0 1rem 0 #000',
              transform: `scale(${scale}) translate(calc(-50% / ${scale} / ${1 / scale}), 999px)`,
              opacity: 0,
              filter: 'brightness(0.75)',
              transition: '700ms ease-out',
              // animation: `${showUp} 1s ease-in-out both`,
              ...(index > -1 && {
                opacity: 1,
                transform: `scale(${scale}) translate(calc(-50% / ${scale} / ${1 / scale}), -20vh)`,
              }),
              ['*']: {
                pointerEvents: 'none',
                userSelect: 'none',
              },
            }}
          >
            {pollListMutate.data && index > -1 && (
              <PollLayout
                data={pollListMutate.data?.[index]}
                // polls={pollListMutate.data?.[index]?.options}
                polls={previewOptions}
                setPolls={() => {}}
              />
            )}
          </Box>
        </Box>
        <Stack direction="row" gap={5}>
          {pollListMutate.data?.map((poll: APIPoll, i: number) => (
            <Stack
              className="preview-entry"
              key={poll.id}
              gap={1}
              p={2}
              width={60 * 2.1}
              height={60 * 2.97}
              data-index={i}
              sx={{
                cursor: 'pointer',
                userSelect: 'none',
                border: `2px solid ${index === i ? '#485' : '#ccc'}`,
                transition: '150ms ease',
                ['&:hover']: {
                  boxShadow: 'inset 0 0 0 9999999px #eee',
                },
              }}
            >
              <Typography className="font-maru" fontWeight={700}>
                {poll.title}
              </Typography>
              <Typography className="font-maru" variant="overline">
                {JSON.parse(poll.options).length}개 문항
              </Typography>

              <Typography className="font-maru" variant="caption">
                {dayjs(poll.expiresAt).format('YYYY. MM. DD. HH:mm') + ' 까지'}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Stack>
  );
};

export default PollList;
