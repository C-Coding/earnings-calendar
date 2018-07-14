import React, { PureComponent } from 'react';
import { Table, Spin } from 'antd'
import s from './index.less';
import Chart from './Chart.jsx'
import { MoneyFormat } from '@/utils/MoneyFormat.js';


const TableCols = [//table列定义
    {
        title: '发布时间',
        dataIndex: 'releaseDate',
        width: 40,
        key: 'releaseDate',
        className: 'releaseDate'
    },
    {
        title: '截止日期',
        dataIndex: 'periodEnd',
        width: 60,
        className: 'periodEnd'
    },
    {
        title: '每股收益/预测',
        width: 120,
        className: s.EPS,
        key: 'EPS',
        render: (text, record) => (
            <div>
                <span className={`${s.value} ${record.EPS ? '' : 'fontTint'}`}>{record.EPS || '--'}</span>
                <span className={`${s.slash} ${record.EPS || record.EPSForecast ? '' : 'fontTint'}`}>/</span>
                <span className={`${s.forecast} ${record.EPSForecast ? '' : 'fontTint'}`}>{record.EPSForecast || '--'}</span>
            </div>
        ),
    },
    {
        title: '总收益/预测',
        width: 160,
        key: 'revenue',
        className: s.revenue,
        render: (text, record) => (
            <div>
                <span className={`${s.value} ${record.revenue ? '' : 'fontTint'}`}>{MoneyFormat(record.revenue) || '--'}</span>
                <span className={`${s.slash} ${record.revenue || record.revenueForecast ? '' : 'fontTint'}`}>/</span>
                <span className={`${s.forecast} ${record.revenueForecast ? '' : 'fontTint'}`}>{MoneyFormat(record.revenueForecast) || '--'}</span>
            </div>
        )
    }
];

class StockDetail extends PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            loading: true,
            chartData: [],
            data: []
        }
    }
    componentDidMount() {
        this.$api.historicalEarnings(this.props.pairId).then(d => {
            d = d.data.data;
            this.setState({
                loading: false,
                data: d
            })

        });

        // let d = require('./data.json').data;

        // this.setState({
        //     data: d,
        //     loading: false

        // })
    }

    render() {
        return (
            <Spin className={s.stockDetail} size="large" spinning={this.state.loading}>

                <Chart data={this.state.data} pairId={this.props.pairId} />


                <Table className={s.table} size="small" rowKey='releaseDate' dataSource={this.state.data} columns={TableCols} />
            </Spin>
        )
    }
}


export default StockDetail