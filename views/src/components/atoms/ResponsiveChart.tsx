import { useMediaQuery, useTheme } from '@mui/material';
import {
  AllSeriesType,
  BarPlot,
  BarSeriesType,
  ChartsAxisHighlight,
  ChartsGrid,
  ChartsLegend,
  ChartsReferenceLine,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LineHighlightPlot,
  LinePlot,
  LineSeriesType,
  MarkPlot,
  PieSeriesType,
  PieValueType,
  ResponsiveChartContainer,
  ScatterSeriesType,
} from '@mui/x-charts';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';

interface ResponsiveChartProps {
  type?: 'time' | 'linear' | 'log' | 'band' | 'point' | 'pow' | 'sqrt' | 'utc';
  hidden?: boolean;
  guideline?: boolean;
  dates: string[];
  responseData: AllSeriesType[];
}
const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  type = 'point',
  hidden = false,
  dates,
  responseData,
  guideline = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <ResponsiveChartContainer
      colors={[
        '#ff9800',
        '#ff69b4',
        '#4caf50',
        '#2196f3',
        '#9c27b0',
        '#e91e63',
        '#009688',
        '#673ab7',
        '#3f51b5',
        '#ffc107',
        '#8bc34a',
        '#9e9e9e',
        '#795548',
        '#03a9f4',
        '#00bcd4',
      ]}
      xAxis={[
        {
          scaleType: type,
          label: 'weeks',
          data: dates,
          ...(!isMdUp && {
            tickLabelStyle: {
              angle: -30,
              textAnchor: 'end',
              fontSize: 10,
            },
          }),
        },
      ]}
      series={responseData}
    >
      <ChartsAxisHighlight x={type === 'band' ? 'band' : 'line'} y="line" />
      <ChartsLegend
        itemMarkHeight={2}
        itemMarkWidth={10}
        labelStyle={{ fontSize: isMdUp ? 14 : 12 }}
        // itemGap={10}
        hidden={hidden}
      />
      <ChartsGrid vertical horizontal />
      <ChartsTooltip />
      <LinePlot />
      <BarPlot />
      <MarkPlot />
      <LineHighlightPlot />
      {guideline && (
        <ChartsReferenceLine
          x={dayjs().format('YYYY-MM-DD')}
          lineStyle={{
            strokeDasharray: '10 5',
            display: 'flex',
          }}
          labelStyle={{
            fontSize: 12,
            fontWeight: 700,
          }}
          label={`Today`}
          labelAlign="start"
        />
      )}
      <ChartsXAxis />
      <ChartsYAxis />
    </ResponsiveChartContainer>
  );
};

export default ResponsiveChart;
