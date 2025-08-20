import React, { useMemo } from 'react';
import { Alert, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { COLORS } from 'app/utils/constants/colors';

// Function to generate the time series data and format it for charting
function generateChartData(stations, selectedType) {
  const timestamps = new Set();
  const productSeriesData = {};

  // Collect all unique timestamps
  stations.forEach(station => {
    station.report_data?.forEach(report => {
      timestamps.add(report.as_at);
    });
  });

  // Sort the timestamps in ascending order
  const sortedTimestamps = Array.from(timestamps).sort((a, b) => new Date(a) - new Date(b));

  sortedTimestamps.forEach(timestamp => {
    const aggregatedProductValues = {};

    stations.forEach(station => {
      const reportAtTimestamp = station.report_data?.find(report => new Date(report.as_at).getTime() === new Date(timestamp).getTime());

      if (reportAtTimestamp) {
        reportAtTimestamp.readings.forEach(reading => {
          const productName = reading.name;

          // Sum the total value for this product across all tanks in the station at this timestamp
          let totalValue = 0;
          reading.tanks.forEach(tank => {
            totalValue += (selectedType === 'calculated stock' ? tank.calculated_stock : selectedType === 'deviation' ? tank.deviation : tank.reading);
          });

          // Aggregate the value across all stations
          if (!aggregatedProductValues[productName]) {
            aggregatedProductValues[productName] = 0;
          }
          aggregatedProductValues[productName] += totalValue;
        });
      }
    });

    // Store the aggregated data for each product
    Object.keys(aggregatedProductValues).forEach(productName => {
      if (!productSeriesData[productName]) {
        productSeriesData[productName] = [];
      }
      productSeriesData[productName].push({
        time: new Date(timestamp),
        value: aggregatedProductValues[productName],
      });
    });
  });

  // Convert productSeriesData into an array format suitable for recharts
  return Object.keys(productSeriesData).map(productName => ({
    name: productName,
    data: productSeriesData[productName],
  }));
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = dayjs(label).format('dddd, MMMM D, YYYY, h:mm A');

    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
        <Typography variant="body2">{formattedDate}</Typography>
        {payload.map((item, index) => (
          <Typography key={index} className="product" style={{ marginTop: '5px' }}>
            {item.name}: {item.value.toLocaleString()}
          </Typography>
        ))}
      </div>
    );
  }

  return null;
};

// Function to get color by index
function getColorByIndex(index) {
  return COLORS[index % COLORS.length];
}

function DippingTrend({ reportData, selectedType }) {
  // Memoize the chart data to ensure it is only recalculated when reportData or selectedType changes.
  const chartData = useMemo(() => generateChartData(reportData, selectedType), [reportData, selectedType]);

  // Combine the data for charting
  const combinedData = chartData.reduce((acc, dataset) => {
    dataset.data.forEach(({ time, value }) => {
      const timeString = time.toISOString();
      if (!acc[timeString]) {
        acc[timeString] = { time };
      }
      acc[timeString][dataset.name] = value;
    });
    return acc;
  }, {});

  const finalData = Object.values(combinedData);

  return (
    <div>
      <Typography mb={2} variant="h5" gutterBottom>
        Dipping Trend
      </Typography>
      <ResponsiveContainer width="100%" height={220}>
        {finalData.length > 0 ?
          <LineChart data={finalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={time => dayjs(time).format('ddd, MMM D, YYYY')} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingBottom: 40 }}
            />
            {chartData.map((dataset, index) => (
              <Line
                key={dataset.name}
                type="monotone"
                dataKey={dataset.name}
                stroke={getColorByIndex(index)} // Use manual color
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
          :
          <Alert variant={'outlined'} severity={'info'}>No Trend for the selected period</Alert>
        }
      </ResponsiveContainer>
    </div>
  );
}

export default DippingTrend;

