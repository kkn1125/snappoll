import { getPoll } from '@/apis/poll/getPoll';
import CorrelationChart from '@components/organisms/CorrelationChart';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import {
  Alert,
  AlertTitle,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { BarChart, PieChart, PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

interface PollGraphProps {}
const PollGraph: React.FC<PollGraphProps> = () => {
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

  if (!data) return <></>;

  return (
    <Container>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h3" fontWeight={700}>
          설문지: {data.title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          질문 타입 빈도
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
              data: data.question.reduce(
                (acc, question) => {
                  const typed = acc.find((a) => a.label === question.type);
                  if (!typed) {
                    acc.push({
                      id: acc.length + 1,
                      value: 1,
                      label: question.type,
                    });
                  } else {
                    if (typeof typed.value === 'number') {
                      typed.value += 1;
                    }
                  }
                  return acc;
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
      <Stack spacing={4} alignItems="center">
        {data.question
          .filter((question) => question.type !== 'text')
          .map((question) => (
            <Stack key={question.id}>
              <Typography variant="h5" fontWeight={700}>
                질문: {question.title}
              </Typography>
              <BarChart
                axisHighlight={{ y: 'line' }}
                borderRadius={10}
                xAxis={[
                  {
                    scaleType: 'band',
                    data:
                      question.option?.map((option) => option.content) || [],
                  },
                ]}
                series={[
                  {
                    data: getCounter(question) || [],
                    highlightScope: { highlight: 'item', fade: 'global' },
                  },
                ]}
                width={700}
                height={300}
              />
            </Stack>
          ))}
      </Stack>
      <Divider flexItem sx={{ my: 5 }} />
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
      <Toolbar />
    </Container>
  );
};

export default PollGraph;
