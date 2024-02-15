import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, Typography } from '@mui/material';
const RadialMultiple = ({ title, buyAvg, sellAvg }) => {
    var options = {
        series: [sellAvg, buyAvg],
        chart: {
            width: 380,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270
            }
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'gradient',
        },
        legend: {
            formatter: function (val, opts) {
                const seriesNames = ['Sell', 'Buy']; // Custom series names
                return seriesNames[opts.seriesIndex] + " - " + opts.w.globals.series[opts.seriesIndex];
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };




    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <ReactApexChart options={options} series={options.series} type="donut" height={360} />
            </CardContent>
        </Card>
    );
};

export default RadialMultiple;
