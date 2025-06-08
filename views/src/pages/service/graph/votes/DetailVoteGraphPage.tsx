import { getGraphVoteData } from '@apis/vote/getGraphVoteData';
import { CHART_COLORS, GRAPH } from '@common/variables';
import ResponsiveChart from '@components/atoms/ResponsiveChart';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ThreePIcon from '@mui/icons-material/ThreeP';
import {
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { PieChart, PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

interface DetailVoteGraphPageProps {}
const DetailVoteGraphPage: React.FC<DetailVoteGraphPageProps> = () => {
  const { id } = useParams();
  const { data } = useQuery<SnapResponseType<SnapVote>>({
    queryKey: ['getGraphVoteData', id],
    queryFn: () => getGraphVoteData(id),
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

  const getDates = useMemo(() => {
    const now = dayjs();
    const todayNumber = now.day();
    const sunday = now.add(6 - todayNumber, 'd');
    return Array.from(Array(7), (_, i) => {
      return sunday.subtract(7 - i - 1, 'day').format('YYYY-MM-DD');
    });
  }, []);

  const respondentWeek = useMemo(() => {
    const response = responseData?.voteResponse;
    if (!response) return [];
    return getDates.map((date) =>
      response.reduce((acc, response) => {
        const formatted = dayjs(response.createdAt).format('YYYY-MM-DD');
        return date === formatted ? acc + 1 : acc;
      }, 0),
    );
  }, [getDates, responseData?.voteResponse]);

  if (!responseData) return <></>;

  return (
    <Stack gap={4}>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4" fontWeight={700}>
          투표지: {responseData.title}
        </Typography>

        <Table>
          <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormatListBulletedIcon fontSize="small" color="info" /> 총 항목
                개수
              </TableCell>
              <TableCell align="right">
                {responseData.voteOption.length}개
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThreePIcon fontSize="small" color="info" /> 참여 인원
              </TableCell>
              <TableCell align="right">
                {responseData.voteResponse?.length ?? 0}명
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider flexItem />
        <Typography variant="h5" fontWeight={700}>
          일별 투표 참여도
        </Typography>
        <Stack
          direction="row"
          width="100%"
          maxWidth="80%"
          mx="auto"
          minHeight="30vh"
          height="100vh"
          maxHeight={GRAPH.MAX_HEIGHT}
        >
          <Stack
            direction="row"
            width="100%"
            mx="auto"
            minHeight="30vh"
            height="100vh"
            maxHeight={GRAPH.MAX_HEIGHT}
          >
            <ResponsiveChart
              dates={getDates}
              responseData={[
                {
                  type: 'line',
                  data: respondentWeek,
                  label: '투표 수',
                },
              ]}
            />
          </Stack>
        </Stack>
        <Typography variant="h5" fontWeight={700}>
          빈도
        </Typography>
        <PieChart
          colors={CHART_COLORS}
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
