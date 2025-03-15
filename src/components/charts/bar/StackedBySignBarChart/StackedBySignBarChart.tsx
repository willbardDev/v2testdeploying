'use client';
import { JumboCard } from '@jumbo/components';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { barData as data } from '../data';

const StackedBySignBarChart = () => (
  <JumboCard
    title={'Bar Chart Stacked by Sign'}
    contentWrapper
    contentSx={{ backgroundColor: 'background.paper' }}
  >
    <ResponsiveContainer width='100%' height={200}>
      <BarChart
        data={data}
        stackOffset='sign'
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis dataKey='name' />
        <YAxis />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip
          labelStyle={{ color: 'black' }}
          itemStyle={{ color: 'black' }}
          cursor={false}
        />
        <Legend />
        <defs>
          <linearGradient id='color1' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#6200EE' stopOpacity={1} />
            <stop offset='95%' stopColor='#B819D2' stopOpacity={1} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id='color2' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#1ABBDE' stopOpacity={1} />
            <stop offset='95%' stopColor='#09BCA7' stopOpacity={1} />
          </linearGradient>
        </defs>
        <ReferenceLine y={0} stroke='#000' />
        <Bar dataKey='pv' fill={'#1e88e5'} stackId='stack' />
        <Bar dataKey='uv' fill={'#e91e63'} stackId='stack' />
      </BarChart>
    </ResponsiveContainer>
  </JumboCard>
);

export { StackedBySignBarChart };
