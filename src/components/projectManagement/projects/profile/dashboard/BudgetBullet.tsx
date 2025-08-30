import React from 'react'
import { HighchartsReact } from 'highcharts-react-official'
import Highcharts from 'highcharts'
import bullet from 'highcharts/modules/bullet';
import { useProjectProfile } from '../ProjectProfileProvider';

bullet(Highcharts);

function BudgetBullet() {
    const { project } = useProjectProfile();

    const options = {
        chart: {
            inverted: true,
            type: 'bullet',
            height: 130,
            marginLeft: 130
        },
        title: {
            text: 'Budget'
        },
        xAxis: {
            categories: [
                '<span class="hc-cat-title">Budget</span><br/>' +
                `(${project.budget.toLocaleString()})`
            ]
        },
        yAxis: {
            gridLineWidth: 0,
            plotBands: [{
                from: 0,
                to: project.budget,
                color: '#29A3AD'
            }],
            title: null
        },
        series: [{
            name: 'Budget',
            data: [{
                y: 750000, 
                target: 600000
            }]
        }],
        tooltip: {
            pointFormat: '<b>{point.y}</b> (with target at {point.target})'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                pointPadding: 0.25,
                borderWidth: 0,
                color: '#000',
                targetOptions: {
                    width: '200%'
                }
            }
        },
        exporting: {
            enabled: false
        }
    };
    
  return (
    <HighchartsReact
        options={options}
        highcharts={Highcharts}
    />
  )
}

export default BudgetBullet