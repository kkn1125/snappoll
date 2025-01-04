import { CHART_COLORS } from '@common/variables';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  AllSeriesType,
  BarPlot,
  ChartsAxisHighlight,
  ChartsGrid,
  ChartsLegend,
  ChartsReferenceLine,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LineHighlightPlot,
  LinePlot,
  MarkPlot,
  ResponsiveChartContainer,
} from '@mui/x-charts';
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
      colors={CHART_COLORS}
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
