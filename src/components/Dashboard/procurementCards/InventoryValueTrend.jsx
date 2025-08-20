import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import financialReportsServices from '../../accounts/reports/financial-reports-services';
import { Button, ButtonGroup, FormControl, InputLabel, LinearProgress, MenuItem, Select, Tooltip, useMediaQuery } from '@mui/material';
import { Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartTooltip, ComposedChart, Line } from 'recharts';
import { useDashboardSettings } from '../Dashboard';
import { shortNumber } from 'app/helpers/input-sanitization-helpers';
import { useJumboTheme } from '@jumbo/hooks';
import Div from '@jumbo/shared/Div/Div';
import dayjs from 'dayjs';

function InventoryValueTrend() {
  const {theme} = useJumboTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const xlScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const {chartFilters : {from,to,cost_center_ids}} = useDashboardSettings();
  const [params, setParams] = useState({ 
      from,
      to,
      cost_center_ids,
      aggregate_by: 'day'
  });

  useEffect(() => {
    setParams(params => ({...params, from, to, cost_center_ids}));
  }, [from, to, cost_center_ids]);

  const processInventoryValues = (data, aggregateBy) => {
    if (!data || data.length === 0) return [];
  
    // Determine top 5 categories at the latest timestamp
    const latestTimestamp = data[data.length - 1];
    const sortedCategories = Object.entries(latestTimestamp.groupedValues || {})
      .map(([key, value]) => ({ key, value: value.balanceValue || 0 }))
      .sort((a, b) => b.value - a.value);
  
    const top5Categories = sortedCategories.slice(0, 5).map(item => item.key);
  
    return data.map(item => {
      const transformedItem = {
        name: aggregateBy === 'day' ? dayjs(item.asOf).format('ddd, MMM D, YYYY') : item.asOf
      };
  
      let totalValue = 0;
      let othersValue = 0;
  
      top5Categories.forEach(category => {
        const value = item.groupedValues?.[category]?.balanceValue || 0;
        transformedItem[category] = value;
        totalValue += value;
      });
  
      // Calculate "Others" value
      Object.keys(item.groupedValues || {}).forEach(category => {
        if (!top5Categories.includes(category)) {
          othersValue += item.groupedValues[category].balanceValue || 0;
        }
      });
  
      if (othersValue > 0) {
        transformedItem['Others'] = othersValue; // Include "Others" only if it has a value > 0
        totalValue += othersValue;
      }
  
      transformedItem['Total Value'] = totalValue;
  
      return transformedItem;
    });
  };

  const { data: inventoryValues, isLoading } = useQuery(['inventoryValueTrend', params], async () => {
    const stockValues = await financialReportsServices.inventoryValue({
      from: params.from,
      to: params.to,
      cost_center_ids: params.cost_center_ids,
      aggregate_by: params.aggregate_by,
      group_by: 'product_category'
    });

    return processInventoryValues(stockValues, params.aggregate_by);
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  // Generate color codes for each property dynamically
  const colorCodes = {};
  for (const key in inventoryValues[0]) {
    if (key !== 'name') {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colorCodes[key] = randomColor;
    }
  }

  const renderAreas = inventoryValues.length > 0 && Object.keys(inventoryValues[0])
    .filter((key) => key !== 'name' && key !== 'Total Value')
    .map((key) => (
      <Area
        key={key}
        type="monotone"
        dataKey={key}
        stackId="1"
        stroke="#0023ef"
        fill={colorCodes[key]}
        fillOpacity={0.3}
        strokeOpacity={0.5}
      />
  ));

  return (
    <JumboCardQuick
      title={'Inventory Value'}
      sx={{
        height: xlScreen ? 310 : null
      }}
      action={
        !smallScreen ?
          <ButtonGroup
            variant="outlined"
            size='small'
            disableElevation
          >
            <Tooltip title={'Daily Trend'}>
              <Button variant={params.aggregate_by === "day" ? "contained" : "outlined"}
                onClick={() => setParams(params => ({ ...params, aggregate_by: 'day' }))}
              >Daily</Button>
            </Tooltip>
            <Tooltip title={'Weekly Trend'}>
              <Button variant={params.aggregate_by === "week" ? "contained" : "outlined"}
                onClick={() => setParams(params => ({ ...params, aggregate_by: 'week' }))}
              >Weekly</Button>
            </Tooltip>
            <Tooltip title={'Monthly Trend'}>
              <Button variant={params.aggregate_by === "month" ? "contained" : "outlined"}
                onClick={() => setParams(params => ({ ...params, aggregate_by: 'month' }))}
              >Monthly</Button>
            </Tooltip>
            <Tooltip title={'Yearly Trend'}>
              <Button variant={params.aggregate_by === "year" ? "contained" : "outlined"}
                onClick={() => setParams(params => ({ ...params, aggregate_by: 'year' }))}
              >Yearly</Button>
            </Tooltip>
          </ButtonGroup>
          :
          <Div sx={{ mt: 1 }}>
            <FormControl fullWidth size='small' label="Interval">
              <InputLabel id="inventory-value-trend-group-by-input-label">Interval</InputLabel>
              <Select
                labelId="inventory-value-trend-group-by-label"
                id="inventory-value-trend-group-by"
                value={params.aggregate_by}
                label={'Interval'}
                onChange={(e) => {
                  setParams(params => ({ ...params, aggregate_by: e.target.value }))
                }}
              >
                <MenuItem value='day'>Daily</MenuItem>
                <MenuItem value='week'>Weekly</MenuItem>
                <MenuItem value='month'>Monthly</MenuItem>
                <MenuItem value='year'>Yearly</MenuItem>
              </Select>
            </FormControl>
          </Div>
      }
    >
      {
        isLoading ? <LinearProgress /> :
          <ResponsiveContainer width="100%" height={xlScreen ? 200 : 238}>
            <ComposedChart data={inventoryValues}>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={shortNumber} />
              <CartesianGrid strokeDasharray="3 3" />
              <RechartTooltip
                labelStyle={{ color: 'black', fontSize: '12px' }}
                itemStyle={{ color: 'black', fontSize: '12px' }}
                cursor={false}
                formatter={(value) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              />
              {renderAreas}
              <Line type="monotone" dataKey="Total Value" dot={''} stroke={"blue"} />
            </ComposedChart>
          </ResponsiveContainer>
      }
    </JumboCardQuick>
  );
}

export default InventoryValueTrend;
  