import React from 'react';
import { useSelector } from 'react-redux';

import { Line } from '@ant-design/charts';

const Memory: React.FC = ({ memoryData }) => {
    const theme = useSelector(state => state.theme.value);

    const title = `${parseFloat(((memoryData.totalmem - memoryData.freemem) / 1024).toFixed(2))} / ${parseFloat((memoryData.totalmem / 1024).toFixed(2))} GB`;

    const config = {
        data: memoryData.chart,
        title: {
            visible: true,
            text: '带数据点的折线图',
        },
        xField: 'create_time',
        yField: 'value',
        // 设置y轴区间
        scale: {
            y: {
                type: 'linear',
                domain: [0, 32 * 1024],
            },
        },
        axis: {
            x: {
                gridLineDash: [0, 0],
                grid: true,
                tick: false,
                label: false,
            },
            y: {
                gridLineDash: [0, 0],
                grid: true,
                tick: false,
                tickLength: 3,
                // label: false,
            },
        },
        height: 500,
        theme: theme === 'light' ? 'classic' : 'classicDark',
    };

    return (
        <>
            <span style={{ fontSize: 14 }}>内存已使用： </span>
            <span style={{ fontSize: 18, fontWeight: '600' }}>{title} </span>

            <Line {...config} />

        </ >
    );
};

export default Memory;