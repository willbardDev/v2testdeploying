'use client';
import { JumboCard } from '@jumbo/components';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { pieData1 } from '../data';

const StraightAnglePieChart = () => (
  <JumboCard
    title={'Straight Angle Pie Chart'}
    contentWrapper
    contentSx={{ backgroundColor: 'background.paper' }}
  >
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          dataKey='value'
          startAngle={270}
          endAngle={0}
          data={pieData1}
          outerRadius={80}
          fill={'#1e88e5'}
          label
        />
      </PieChart>
    </ResponsiveContainer>
  </JumboCard>
);

export { StraightAnglePieChart };
