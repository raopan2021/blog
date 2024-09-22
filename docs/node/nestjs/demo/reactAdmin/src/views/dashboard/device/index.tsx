import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import api from '../../../api';
import './index.scss';
import Memory from './memory';

const Device: React.FC = () => {
    const [memoryData, setMemoryData] = useState({});

    const [model, setModel] = useState('')
    const [uptime, setUpTime] = useState('')

    //    每秒发送一次请求
    useEffect(() => {
        const timer = setInterval(() => {
            getData();
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    });

    const getData = () => {
        api.get('device')
            .then(res => {
                const chart = res.map(({ totalmem, freemem, create_time }) => {
                    return {
                        create_time: dayjs(create_time).format('mm:ss'),
                        value: totalmem - freemem,
                    };
                });
                const { totalmem, freemem, model, uptime } = res[res.length - 1];
                setMemoryData({ chart, totalmem, freemem });
                setModel(model)
                setUpTime(dayjs().startOf('day').second(uptime).format('HH时mm分ss秒'))
            });
    };

    return (
        <>
            <h1>{model}</h1>
            {Object.keys(memoryData).length > 0 && < Memory memoryData={memoryData} />}
            <span style={{ fontSize: 14 }}>设备已运行： </span>
            <span style={{ fontSize: 18, fontWeight: '600' }}>{uptime} </span>
        </>
    );
};

export default Device;
