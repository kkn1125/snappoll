import { getPoll } from '@/apis/poll/getPoll';
import CorrelationChart from '@components/organisms/CorrelationChart';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ThreePIcon from '@mui/icons-material/ThreeP';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BarChart, PieChart, PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

interface DetailPollGraphPageProps {}
const DetailPollGraphPage: React.FC<DetailPollGraphPageProps> = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { data } = useQuery<SnapPoll>({
    queryKey: ['getPoll', id],
    queryFn: () => getPoll(id),
  });
  const getCounter = useCallback((question?: SnapPollQuestion) => {
    if (!question) return [];
    const counted = question.option.map((option) => {
      return (
        question.answer?.reduce((acc, answer) => {
          if (answer.optionId === option.id) {
            return acc + 1;
          }
          return acc;
        }, 0) || 0
      );
    });
    return counted;
  }, []);
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  if (!data) return <></>;

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
          설문지: {data.title}
        </Typography>

        <Table>
          <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FeaturedPlayListIcon fontSize="small" color="info" /> 총 질문
                개수
              </TableCell>
              <TableCell align="right">
                {data.question?.length ?? 0}개
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormatListBulletedIcon fontSize="small" color="info" /> 총 문항
                개수
              </TableCell>
              <TableCell align="right">
                {data.question.reduce(
                  (acc, cur) => acc + (cur.option.length ?? 0),
                  0,
                )}
                개
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThreePIcon fontSize="small" color="info" /> 참여 인원
              </TableCell>
              <TableCell align="right">
                {data.response?.length ?? 0}명
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="h5" fontWeight={700}>
          질문 타입 비율
        </Typography>
        <Stack direction="row" width="100%">
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
                data: data.question.reduce(
                  (acc, question) => {
                    const typed = acc.find((a) => a.label === question.type);
                    if (typed && typeof typed.value === 'number') {
                      typed.value += 1;
                    }
                    return acc;
                  },
                  [
                    { label: 'text', value: 0, id: 0 },
                    { label: 'select', value: 0, id: 1 },
                    { label: 'checkbox', value: 0, id: 2 },
                  ] as MakeOptional<PieValueType, 'id'>[],
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
      <Stack spacing={4} alignItems="center">
        {data.question
          .filter((question) => question.type !== 'text')
          .map((question) => (
            <Stack key={question.id} width="100%">
              <Typography variant="h5" fontWeight={700} whiteSpace="wrap">
                질문: {question.title}
              </Typography>
              <Stack
                direction="row"
                width="100%"
                minHeight="30vh"
                height="100vh"
                maxHeight={400}
              >
                <BarChart
                  axisHighlight={{ y: 'line' }}
                  borderRadius={10}
                  xAxis={[
                    {
                      scaleType: 'band',
                      data:
                        question.option?.map((option) => option.content) || [],
                      ...(isMdDown && {
                        tickLabelStyle: {
                          angle: -20,
                          textAnchor: 'end',
                          fontSize: 10,
                        },
                      }),
                    },
                  ]}
                  series={[
                    {
                      data: getCounter(question) || [],
                      highlightScope: { highlight: 'item', fade: 'global' },
                    },
                  ]}
                />
              </Stack>
            </Stack>
          ))}
      </Stack>

      <Divider flexItem sx={{ my: 5 }} />

      <Stack>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          사용자 설정 그래프
        </Typography>
        {data.question.length > 1 ? (
          <CorrelationChart data={data} />
        ) : (
          <Alert severity="info">
            <AlertTitle>안내</AlertTitle>
            비교 그래프 생성은 최소 2개 일 때 이용가능합니다.
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};

export default DetailPollGraphPage;
