'use client';
import { JumboCard } from '@jumbo/components';
import { Div } from '@jumbo/shared';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { connectNullData } from '../data';

const ConnectNullAreaChart = () => (
  <JumboCard
    title={'Connect Nulls Area Chart'}
    contentWrapper
    contentSx={{ flexDirection: 'column', backgroundColor: 'background.paper' }}
  >
    <Div sx={{ mb: 5, alignSelf: 'stretch' }}>
      <ResponsiveContainer width='100%' height={200}>
        <AreaChart
          data={connectNullData}
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
          <defs>
            <linearGradient id='color3' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#6200EE' stopOpacity={1} />
              <stop offset='95%' stopColor='#B819D2' stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey='uv'
            stroke=''
            fill={'#1e88e5'}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Div>
    <Div sx={{ alignSelf: 'stretch' }}>
      <ResponsiveContainer width='100%' height={200}>
        <AreaChart
          data={connectNullData}
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
          <defs>
            <linearGradient id='color3' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#6200EE' stopOpacity={1} />
              <stop offset='95%' stopColor='#B819D2' stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area
            connectNulls={true}
            type='monotone'
            dataKey='uv'
            stroke=''
            fill={'#1e88e5'}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Div>
  </JumboCard>
);

export { ConnectNullAreaChart };
