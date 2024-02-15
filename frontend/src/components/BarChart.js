import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, Typography } from '@mui/material';
const BarChart = ({ title, buyPrices, sellPrices, sources }) => {
    console.log("buyPrice : ", buyPrices);
    console.log("sellPrices : ", sellPrices);
    var options = {
        series: [{
            name: 'Sell Prices',
            data: sellPrices || []
        }, {
            name: 'Buy Prices',
            data: buyPrices || []
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['ambito', 'dolarhoy', 'cronista'],
        },
        yaxis: {
            title: {
                text: title
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            }
        }
    };


    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <ReactApexChart options={options} series={options.series} type="bar" height={350} />
            </CardContent>
        </Card>
    );
};

export default BarChart;
