import { getPolls } from '@/apis/getPolls';
import {
  Box,
  Container,
  keyframes,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import PreviewPoll from './PreviewPoll';
import PollLayout from '@components/templates/PollLayout';

interface PollListProps {}
const PollList: React.FC<PollListProps> = () => {
  // const showUp = keyframes`
  // 0%   {
  //   opacity: 0;
  //   transform: translate(-50%, 100%);
  // }
  // 100% {
  //   opacity: 1;
  //   transform: translate(-50%, 0%);
  // }
  // `;
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);
  const pollListMutate = useMutation({
    mutationKey: ['pollList'],
    mutationFn: getPolls,
    onSuccess(data, variables, context) {
      console.log(data);
    },
  });

  useEffect(() => {
    pollListMutate.mutate();

    // function handleHoverDetect(e: MouseEvent) {
    //   const target = e.target as HTMLElement;
    //   if (target.dataset.type === 'paper') {
    //     setHovered(true);
    //   } else {
    //     setHovered(false);
    //   }
    // }

    // window.addEventListener('mousemove', handleHoverDetect);

    // return () => {
    //   window.removeEventListener('mousemove', handleHoverDetect);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleHoverPoll(idx: number) {
    setHovered(true);
    setIndex(idx);
  }

  const previewOptions = useMemo(() => {
    return pollListMutate.data?.[index]?.options
      ? JSON.parse(pollListMutate.data?.[index]?.options)
      : [];
  }, [index, pollListMutate.data]);

  return (
    <Stack height="inherit" flex={1} pb={5}>
      <Container component={Stack} flex={1}>
        <Box
          position="relative"
          flex={1}
          overflow="hidden"
          mb={8}
          sx={{ boxShadow: 'inset 0 0 1rem 1rem #ffffff' }}
        >
          <Box
            position="absolute"
            width="50vw"
            overflow="hidden"
            left="50%"
            pt={5}
            px={5}
            height="100vh"
            sx={{
              zIndex: -1,
              borderTop: '1px solid #eee',
              borderInline: '1px solid #eee',
              boxShadow: '0 0 1rem 0 #000',
              transform: 'translate(-50%, 999px)',
              opacity: 0,
              transition: '700ms ease-out',
              // animation: `${showUp} 1s ease-in-out both`,
              ...(hovered && {
                opacity: 1,
                transform: 'translate(-50%, 10vh)',
              }),
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
              key={poll.id}
              gap={1}
              p={2}
              width={60 * 2.1}
              height={60 * 2.97}
              sx={{ border: '1px solid #ccc' }}
              onMouseEnter={() => handleHoverPoll(i)}
              onMouseLeave={() => {
                setHovered(false);
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
