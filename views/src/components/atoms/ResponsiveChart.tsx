import { useMediaQuery, useTheme } from '@mui/material';
import {
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
  dates: string[];
  responseData: {
    type: 'line' | 'bar' | 'scatter' | 'pie' | string;
    data: number[];
    label: string;
  }[];
}
const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  type,
  hidden = false,
  dates,
  responseData,
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
          scaleType: type ?? 'point',
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
      series={
        responseData.map((item) => ({
          type: item.type,
          data: item.data,
          label: item.label,
        })) as (
          | BarSeriesType
          | LineSeriesType
          | ScatterSeriesType
          | PieSeriesType<MakeOptional<PieValueType, 'id'>>
        )[]
      }
    >
      <ChartsAxisHighlight x="line" y="line" />
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
      <ChartsReferenceLine
        x={dayjs().format('YYYY-MM-DD')}
        lineStyle={{ strokeDasharray: '10 5' }}
        labelStyle={{
          fontSize: 12,
          fontWeight: 700,
        }}
        label={`Today`}
        labelAlign="start"
      />
      <ChartsXAxis />
      <ChartsYAxis />
    </ResponsiveChartContainer>
  );
};

export default ResponsiveChart;
