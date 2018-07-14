import React, { PureComponent } from 'react';
import { Table, Tooltip } from 'antd';
import s from './index.less';
import moment from 'moment'
import { MoneyFormat } from '@/utils/MoneyFormat.js';

const TableCols = [
    {
        title: '国家',
        width: 60,
        dataIndex: 'country',
        key: 'country',
        className: s.country,
        render: (text, record) => (
            <Tooltip title={record.country}>
                <span className={`flag-icon flag-icon-${record.countryCode}`}></span>
            </Tooltip>
        )
    },
    {
        title: '代号',
        width: 70,
        dataIndex: 'code',
        className: s.code
    },
    {
        title: '名称',
        className: s.name,
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '每股收益/预测',
        width: 160,
        key: 'EPS',
        className: s.EPS,
        render: (text, record) => {
            return (
                <div>
                    <span className={`${s.value} ${record.EPS?'':'fontTint'}`}>{record.EPS || '--'}</span>
                    <span className={`${s.slash} ${record.EPS||record.EPSForecast?'':'fontTint'}`}>/</span>
                    <span className={`${s.forecast} ${record.EPSForecast?'':'fontTint'}`}>{record.EPSForecast || '--'}</span>
                </div>
            )
        },
    },
    {
        title: '总收益/预测',
        width: 160,
        key: 'revenue',
        className: s.revenue,
        render: (text, record) => (
            <div>
                <span className={`${s.value} ${record.revenue?'':'fontTint'}`}>{MoneyFormat(record.revenue) || '--'}</span>
                <span className={`${s.slash} ${record.revenue||record.revenueForecast?'':'fontTint'}`}>/</span>
                <span className={`${s.forecast} ${record.revenueForecast?'':'fontTint'}`}>{MoneyFormat(record.revenueForecast) || '--'}</span>
            </div>
        )
    },
    {
        title: '市值',
        width: 100,
        key: 'marketcap',
        dataIndex: 'marketcap',
        className: s.marketcap,
        render: (text) => (
            <span>{MoneyFormat(text)}</span>
        )
    },
    {
        title: '财报时间',
        width: 80,
        key: 'reportTime',
        dataIndex: 'reportTime',
        className: s.reportTime,
        render: (text) => {
            if (text) {
                return (
                    <Tooltip title={text === 0 ? '盘前' : '盘后'}>
                        <img src={text === 0 ? require('@/assets/day.svg') : require('@/assets/night.svg')} alt="" />
                    </Tooltip>
                )
            } else {
                return;
            }
        }
    }
];


class TableData extends PureComponent {

    render() {
        TableCols[2].render = (text, record) => (
            <span className={s.nameSpan} onClick={() => {
                this.props.stockSelectedFn(String(record.pairId),record.name)
            }}>{text}</span>
        )
        return this.props.data.map((item, i) => {
            if(item.date===moment().format('YYYY-MM-DD')){
                item.date='今天';
            }else if(item.date===moment().subtract(1,'days').format('YYYY-MM-DD')){
                item.date='昨天';
            }
            return (
                <div key={item.date} className={`${s.content} fontBlack`}>
                    <div className={s.date}>{item.date}</div>
                    <Table
                        showHeader={i === 0}
                        columns={TableCols}
                        dataSource={item.list}
                        rowKey="pairId"
                        size="small"
                        pagination={false}
                        className={s.table}
                    />
                </div>
            )
        })

    }
}

export default TableData