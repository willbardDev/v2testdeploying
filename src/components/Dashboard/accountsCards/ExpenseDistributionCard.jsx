import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick'
import { HighchartsReact } from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { LinearProgress, useMediaQuery } from '@mui/material'
import financialReportsServices from '../../accounts/reports/financial-reports-services'
import { useDashboardSettings } from '../Dashboard'
import { useJumboTheme } from '@jumbo/hooks'

function ExpenseDistributionCard() {

  const {chartFilters : {from,to,cost_center_ids}} = useDashboardSettings();
  const [params, setParams] = useState({ 
      from,
      to,
      cost_center_ids,
      aggregate_by: 'day'
  });
  useEffect(() => {
    setParams(params => ({...params, from, to,cost_center_ids}));
  }, [from,to,cost_center_ids])

  //Screen handling constants
  const {theme} = useJumboTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const {data : expenseDistribution, isLoading} = useQuery(['expenseDistribution',params],async() => {
    const expenses = await financialReportsServices.expenseFigures({
      from: params.from,
      to: params.to,
      ledgerGroupId: 19,
      cost_center_ids: params.cost_center_ids,
      group_by_ledgers: true
    });
    return expenses.map(expense => {
      return {
        name: expense.ledger_name,
        y: expense.amount
      }
    })
  });

  const options = {
    title: {
      text: '<div style="font-family: NoirPro,Arial; font-size: 1.1rem; line-height:1.2; display:block; font-weight: 400; color: #37373C">Operating Expenses</div>',
      align: 'left'
    },chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      height: 245
    },accessibility: {
        enabled: false,
        point: {
            valueSuffix: '%'
        }
    },tooltip: {
      pointFormat: '{point.y}: <b>({point.percentage:.1f}%)</b>'
    },
    series: [{
      name: 'Expenses',
      colorByPoint: true,
      data: expenseDistribution
    }]
  }

  return (
    <JumboCardQuick
      sx={{
        height: xlScreen ? 310 : null
      }}
    >
      {
        isLoading ? 
        <LinearProgress/> 
        : 
        <HighchartsReact
          options={options}
          highcharts={Highcharts}
        />
      }
    </JumboCardQuick>
  )
}

export default ExpenseDistributionCard