import React from 'react';
import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';
import bullet from 'highcharts/modules/bullet';

bullet(Highcharts);

function ProgressBullet() {
    const options = {
        chart: {
            inverted: true,
            type: 'bullet',
            height: 130,
            marginLeft: 130
        },
        title: {
            text: 'Progress'
        },
        xAxis: {
            categories: ['Progress']
        },
        yAxis: {
            gridLineWidth: 0,
            plotBands: [{
                from: 0,
                to: 100,
                color: '#29A3AD'
            }],
            title: null
        },
        series: [{
            name: 'Progress',
            data: [{
                y: 14, 
                target: 29 
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
    );
}

export default ProgressBullet;
