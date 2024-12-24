import { getVote } from '@apis/vote/getVote';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { Box, Button, Stack, Typography } from '@mui/material';
import { PieChart, PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

interface DetailVoteGraphPageProps {}
const DetailVoteGraphPage: React.FC<DetailVoteGraphPageProps> = () => {
  const { id } = useParams();
  const { data } = useQuery<SnapResponseType<SnapVote>>({
    queryKey: ['getVote', id],
    queryFn: () => getVote(id),
  });
  const responseData = data?.data;
  const getCounter = useCallback((option?: SnapVoteOption) => {
    if (!option) return [];
    const counted =
      option.voteAnswer?.reduce((acc, answer) => {
        if (answer.voteOptionId === option.id) {
          return acc + 1;
        }
        return acc;
      }, 0) || 0;
    return counted;
  }, []);

  if (!responseData) return <></>;

  return (
    <Stack gap={4}>
      <Box>
        <Button
          onClick={() => {
            history.back();
          }}
        >
          이전으로
        </Button>
      </Box>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4" fontWeight={700}>
          투표지: {responseData.title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          빈도
        </Typography>
        <PieChart
          series={[
            {
              innerRadius: 50,
              outerRadius: 150,
              paddingAngle: 1,
              startAngle: 0,
              endAngle: 360,
              cornerRadius: 10,
              arcLabelMinAngle: 35,
              highlightScope: { fade: 'global', highlight: 'item' },
              data: responseData.voteOption.map(
                (option, i) => {
                  return {
                    id: i,
                    label: option.content,
                    value: option.voteAnswer?.length || 0,
                  };
                },
                [] as MakeOptional<PieValueType, 'id'>[],
              ),
              arcLabel(item) {
                return item.label || 'unknown';
              },
            },
          ]}
          width={500}
          height={300}
        />
      </Stack>
    </Stack>
  );
};

export default DetailVoteGraphPage;
