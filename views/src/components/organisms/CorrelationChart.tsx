import { GRAPH } from '@common/variables';
import ResponsiveChart from '@components/atoms/ResponsiveChart';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollQuestion } from '@models/SnapPollQuestion';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {
  Badge,
  Button,
  ButtonGroup,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AllSeriesType,
  BarChart,
  BarSeriesType,
  LineSeriesType,
} from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { useCallback, useState } from 'react';

interface CorrelationChartProps {
  data: SnapPoll;
}
const CorrelationChart: React.FC<CorrelationChartProps> = ({ data }) => {
  const [hides, setHides] = useState<Map<string, boolean>>(new Map());
  const [toggleViewType, setToggleViewType] = useState('line');
  // const theme = useTheme();
  const [baseQuestion, setBaseQuestion] = useState<SnapPollQuestion | null>(
    null,
  );
  const [questions, setQuestions] = useState<SnapPollQuestion[]>([]);
  // const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  function handleToggleViewType() {
    setToggleViewType((prev) => (prev === 'line' ? 'bar' : 'line'));
  }
  function handleSetBaseQuestion(question: SnapPollQuestion) {
    if (baseQuestion) {
      setBaseQuestion(null);
      setQuestions([]);
      // setHides(new Map());
    } else {
      setBaseQuestion(question);
      setQuestions((questions) =>
        questions.filter((q) => q.id !== question.id),
      );
    }
  }

  function handleStackQuestion(question: SnapPollQuestion) {
    if (questions.includes(question)) {
      setQuestions((questions) =>
        questions.filter((q) => q.id !== question.id),
      );
      setHides((prev) => {
        const newMap = new Map(prev);
        newMap.delete(question.id);
        return newMap;
      });
    } else {
      setQuestions((questions) => [...questions, question]);
      setHides((prev) => {
        const newMap = new Map(prev);
        newMap.set(question.id, false);
        return newMap;
      });
    }
  }

  const slicedTitle = useCallback((question: SnapPollQuestion) => {
    return question.title.length > 10
      ? question.title.slice(0, 10) + '...'
      : question.title;
  }, []);

  const getCounter = useCallback(
    (question: SnapPollQuestion): AllSeriesType[] => {
      if (baseQuestion === null) return [];
      if (!baseQuestion.answer) return [];

      const result = question.option.map((option) => {
        return {
          data: (baseQuestion.option?.map((opt) => {
            return question.answer?.reduce((acc, cur) => {
              const responseId = cur.responseId;
              const answers = baseQuestion.answer?.filter(
                (answer) =>
                  cur.optionId === option.id &&
                  responseId === answer.responseId &&
                  answer.optionId === opt.id,
              );
              return acc + (answers?.length || 0);
            }, 0);
          }) || []) as number[],
          type: toggleViewType,
          label: option.content,
          // highlightScope: { highlight: 'item', fade: 'global' },
        };
      }) as AllSeriesType[];

      return result;
    },
    [baseQuestion, toggleViewType],
  );

  function handleToggleHide(id: string) {
    setHides((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, !newMap.get(id));
      return newMap;
    });
  }

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
        <Stack>
          <Typography variant="h5" gutterBottom>
            기준 질문
          </Typography>

          <ButtonGroup sx={{ flexWrap: 'wrap' }}>
            {(baseQuestion !== null ? [baseQuestion] : data.question)
              .filter((question) => question.type !== 'text')
              .map((question) => (
                <Badge
                  key={question.id}
                  color="error"
                  variant="dot"
                  invisible={baseQuestion !== question}
                >
                  <Button
                    variant={
                      baseQuestion === question ? 'contained' : 'outlined'
                    }
                    onClick={() => handleSetBaseQuestion(question)}
                  >
                    {slicedTitle(question)}
                  </Button>
                </Badge>
              ))}
          </ButtonGroup>
        </Stack>
        {baseQuestion !== null && (
          <Stack>
            <Typography variant="h5" gutterBottom>
              비교 질문
            </Typography>
            <ButtonGroup sx={{ flexWrap: 'wrap' }}>
              {data.question
                .filter(
                  (question) =>
                    question !== baseQuestion && question.type !== 'text',
                )
                .map((question) => (
                  <Badge
                    key={question.id}
                    color="secondary"
                    badgeContent={Math.max(
                      questions
                        .filter((question) => question !== baseQuestion)
                        .indexOf(question) + 1,
                      -Infinity,
                    )}
                  >
                    <Button
                      variant={
                        questions.includes(question) ? 'contained' : 'outlined'
                      }
                      onClick={() => handleStackQuestion(question)}
                    >
                      {slicedTitle(question)}
                    </Button>
                  </Badge>
                ))}
            </ButtonGroup>
          </Stack>
        )}
      </Stack>
      <Stack gap={5}>
        {baseQuestion && questions.length > 0 && (
          <Stack direction="row" my={1}>
            <Button variant="outlined" onClick={handleToggleViewType}>
              {toggleViewType === 'line' ? '선형그래프' : '바 그래프'}
            </Button>
          </Stack>
        )}
        {baseQuestion &&
          questions.map((question) => (
            <Stack key={baseQuestion.id + question.id} width="100%">
              <Typography variant="h5" gutterBottom>
                {baseQuestion.title} <SyncAltIcon /> {question.title}
              </Typography>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                width="100%"
                maxWidth="80%"
                mx="auto"
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleToggleHide(question.id)}
                >
                  {!hides.get(question.id) ? '범례 숨기기' : '범례 보이기'}
                </Button>
              </Stack>
              <Stack
                direction="row"
                width="100%"
                minHeight="30vh"
                height="100vh"
                maxWidth="80%"
                mx="auto"
                maxHeight={GRAPH.MAX_HEIGHT}
              >
                <ResponsiveChart
                  type={toggleViewType === 'line' ? 'point' : 'band'}
                  dates={
                    baseQuestion.option?.map((option) => option.content) || []
                  }
                  responseData={getCounter(question)}
                  hidden={hides.get(question.id)}
                />
                {/* <BarChart
                  axisHighlight={{ y: 'line' }}
                  borderRadius={10}
                  xAxis={[
                    {
                      scaleType: 'band',
                      data:
                        baseQuestion.option?.map((option) => option.content) ||
                        [],
                      tickLabelStyle: {
                        angle: -20,
                        textAnchor: 'end',
                        fontSize: 10,
                      },
                    },
                  ]}
                  series={getCounter(question)}
                  slotProps={{
                    legend: {
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      padding: 0,
                      markGap: 3,
                      itemGap: 5,
                    },
                  }}
                  sx={{ flex: 1 }}
                /> */}
              </Stack>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

export default CorrelationChart;
