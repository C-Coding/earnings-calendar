import React, { Component } from 'react';
import { Spin } from 'antd';
import moment from 'moment';

import s from './index.less';

import { MoneyFormat } from '@/utils/MoneyFormat.js';

import { numFixed } from '@/utils/Num.js';


import ChartShapeRegister from './ChartShapeRegister.js';

const G2 = window.G2;
const DataSet = window.DataSet;
const Slider = window.Slider;
const Shape = G2.Shape;

//自定义shape
ChartShapeRegister(Shape);





class Chart extends Component {
    constructor(props) {//props 传入data pairId
        super(props);

        this.chartEl = React.createRef();//图表div
        this.sliderEl = React.createRef();//数据选择div
        this.kLineEl = React.createRef();//历史数据图表div

        this.chart = null;//chart实例
        this.main = null;//view实例

        this.slider = null;//slider实例
        this.kLine = null;//kline图chart实例
        this.ds = null;//dataSet实例
        this.dv = null//dataView实例

        this.kLineData = {}//用于缓存k线数据
        this.currentKlineDate = null;//记录当前显示的kline 防止异步后kline被修改

        this.state = {
            kLineLoading: true,
            kLineTip: false
        }



    }


    componentDidMount() {
        /////////////////////////////////////初始化dataset dataview
        const ds = this.ds = new DataSet({
            state: {
                start: null,
                end: null
            }
        });
        this.dv = ds.createView();


        //////////////////////////////////////////初始化chart数据配置
        const mainChart = this.chart = new G2.Chart({
            container: this.chartEl.current,
            forceFit: true,
            height: 400,
            padding: [30, 100]
        });
        const main = this.main = mainChart.view({
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 }
        })

        mainChart.on('tooltip:change', ev => {//注册tooltip事件 动态改变kLine data
            const date = ev.items[0].point._origin.releaseDate;

            this.getkLineData(date);
        });

        main.source([]);//导入一个空数据

        main.axis('EPSForecast', false);//不显示EPSForecast数据坐标
        main.axis('revenueForecast', false);//不显示revenueForecast数据坐标
        main.tooltip('预计每股收益*每股收益')

        main.interval().position('releaseDateTimestamp*EPS').color('#3399CC').shape('eps')
        main.interval().position('releaseDateTimestamp*EPSForecast').color('rgba(0,0,0,.65)').shape('epsForecast')
        main.interval().position('releaseDateTimestamp*revenue').color('red').shape('revenueShape')
        main.interval().position('releaseDateTimestamp*revenueForecast').color('rgba(0,0,0,.65)').shape('revenueForcast')


        mainChart.render();//渲染



        //////////////////////////////////////////////初始化slider
        const slider = this.slider = new Slider({
            container: this.sliderEl.current, // dom 容器 id 或者 dom 容器对象
            width: 'auto', // slider 的宽度，默认为 'auto'，即自适应宽度
            height: 40, // slider 的高度，默认为 '26px'
            padding: [60, 100], // slider 所在画布 canvas 的内边距，用于对齐图表，默认与图表默认的 padding 相同
            // start: ds.state.start, // 和状态量对应，滑块的起始点数值，如果是时间类型，建议将其转换为时间戳，方便数据过滤
            // end: ds.state.end, // 和状态量对应，滑块的结束点数值，如果是时间类型，建议将其转换为时间戳，方便数据过滤
            minSpan: 30 * 24 * 60 * 60 * 1000, // 可选，用于设置滑块的最小范围，时间类型的数值必须使用时间戳，这里设置最小范围为 30 天
            // maxSpan: 120 * 24 * 60 * 60 * 1000, // 可选，用于设置滑块的最大范围，时间类型的数值必须使用时间戳，这里设置最大范围为 120 天
            data: [], // slider 的数据源
            xAxis: 'releaseDateTimestamp', // 背景图的横轴对应字段，同时为数据筛选的字段
            yAxis: 'EPS', // 背景图的纵轴对应字段

            scales: {
                releaseDateTimestamp: {
                    type: 'time'
                }
            },
            onChange: ({ startValue, endValue }) => {
                ds.setState('start', startValue);
                ds.setState('end', endValue);
            } // 更新数据状态量的回调函数
        });

        slider.render(); // 渲染



        ////////////////////////////////////////////////////////////////初始化k线图chart
        const kLineChart = new G2.Chart({
            container: this.kLineEl.current,
            forceFit: true,
            height: 300,
            padding: [60, 100]
        });

        kLineChart.tooltip({
            crosshairs: {
                type: 'rect',
            }

        });
        const kLine = this.kLine = kLineChart.view({
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 }
        })
        kLine.scale({
            open: {
                alias: '开盘'
            },
            price: {
                alias: '收盘'
            },
            high: {
                alias: '最高'
            },
            low: {
                alias: '最低'
            },
            change: {
                alias: '涨幅'
            },
            date: {
                type: 'timeCat',
                mask: 'YY年MM月DD日'
            }
        })
        kLine.source([]);
        kLine.schema().position('date*range').shape('candle').tooltip('open*high*low*price*change').color('trend', function (val) {
            if (val === '上涨') {
                return '#f04864';
            }

            if (val === '下跌') {
                return '#2fc25b';
            }
        })


        kLineChart.render();
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps !== this.props) {
            this.init(nextProps.data);
        }
        if (nextState === this.state) {
            return false;
        } else {
            return true;
        }
    }


    init(data) {
        const d = [...data].reverse();//倒置数组 使时间轴变更为从小到大 为正常显示table不修改原数据

        const range = dataHandle(d);


        this.ds.setState('end', d[d.length - 1].releaseDateTimestamp);//设置起始

        this.slider.end = d[d.length - 1].releaseDateTimestamp;//设置slider起始

        if (d.length > 10) {//数据量大于10则设置前10条为默认 否则不显示slider
            this.ds.setState('start', d[d.length - 11].releaseDateTimestamp);
            this.slider.start = d[d.length - 11].releaseDateTimestamp;
        } else {
            this.ds.setState('start', d[0].releaseDateTimestamp);
            this.slider.start = d[0].releaseDateTimestamp;
        }

        this.dv.source(d).transform({//设置显示范围过滤条件
            type: 'filter',
            callback: obj => {
                return obj.releaseDateTimestamp <= this.ds.state.end && obj.releaseDateTimestamp >= this.ds.state.start;
            }
        });



        //配置y轴刻度
        this.main.scale({
            EPS: {
                alias: '每股收益',
                nice: false,
                min: range.EPS[0],
                max: range.EPS[1]
            },
            EPSForecast: {
                alias: '预计每股收益',
                nice: false,
                min: range.EPS[0],
                max: range.EPS[1]
            },
            revenue: {
                alias: '总收益',
                nice: false,
                min: range.revenue[0],
                max: range.revenue[1],
                formatter: v => {
                    return MoneyFormat(v) || '0'
                }
            },
            revenueForecast: {
                alias: '预计总收益',
                nice: false,
                min: range.revenue[0],
                max: range.revenue[1],
                formatter: v => {
                    return MoneyFormat(v) || '0'
                }
            },
            releaseDateTimestamp: {
                type: 'timeCat',
                mask: 'YY年MM月DD日'
            }
        })
        //导入数据
        this.main.changeData(this.dv);
        this.slider.changeData(d);


        this.getkLineData(d[d.length - 1].releaseDate)
    }


    getkLineData(date) {
        this.currentKlineDate = date;
        if (this.kLineData.hasOwnProperty(date)) {//有字段
            if (this.kLineData[date]) {//有字段且存在有效值
                if (this.kLineData[date].length === 0) {
                    this.setState({
                        kLineTip: true
                    })
                } else {
                    this.setState({
                        kLineTip: false
                    })
                }
                this.kLine.changeData(this.kLineData[date]);


                // this.kLine.guide().region({
                //     start: [new Date(date).getTime()-(12*60*60*1000), 'min'],
                //     end: [new Date(date).getTime()+(12*60*60*1000), 'max']
                // });


                return;
            } else {//有字段 无有效值 等待接口回调
                return;
            }
        } else {//无字段 发送请求
            this.kLineData[date] = undefined;//建立字段 作为已发送api标记 避免重复请求
            const dateFrom = moment(date, 'YYYY-MM-DD').subtract(9, 'days').format('YYYY-MM-DD')
            const dateTo = moment(date, 'YYYY-MM-DD').add(9, 'days').format('YYYY-MM-DD')
            this.setState({
                kLineLoading: true
            })
            this.$api.historicalData(this.props.pairId, dateFrom, dateTo).then(d => {
                this.setState({
                    kLineLoading: false
                })
                if (d.data.code !== 0) {
                    return;
                }
                d = d.data.data;





                d.forEach(function (item) {
                    item.date = new Date(item.date).getTime();
                    item.range = [item.open, item.price, item.high, item.low]
                    item.trend = item.change >= 0 ? '上涨' : '下跌'
                    item.change = `${item.change}%`
                })
                if (d.length > 0 && d.length < 15) {
                    do {
                        d.push({
                            date: new Date(d[d.length-1].date+(24*60*60*1000)).getTime()
                        });
                        if (d.length === 15) {
                            break;
                        }
                    } while (true);
                }


                this.kLineData[date] = d;


                if (this.currentKlineDate === date) {
                    this.kLine.changeData(d)
                    if (d.length === 0) {
                        this.setState({
                            kLineTip: true
                        })
                    }
                }
            })
        }
    }








    render() {
        return (
            <div>
                <div ref={this.chartEl} ></div>
                <div ref={this.sliderEl}></div>
                <Spin size="large" spinning={this.state.kLineLoading}>
                    <div ref={this.kLineEl}></div>
                    {
                        this.state.kLineTip ? (
                            <div className={`${s.kLineTip} fontTint`}>no data</div>
                        ) : false
                    }
                </Spin>
            </div>
        )
    }
}



function dataHandle(d) {
    const range = {//储存数据范围
        EPS: [0, 0],//[最小值,最大值]
        EPSForecast: [0, 0],
        revenue: [0, 0],
        revenueForecast: [0, 0]
    }

    d.forEach(function (item) {
        item.releaseDateTimestamp = new Date(item.releaseDate).getTime();//为不影响表格显示 新增储存时间戳字段用于图表

        //获取最小值 最大值
        if (item.EPS < range.EPS[0]) {
            range.EPS[0] = item.EPS;
        } else if (item.EPS > range.EPS[1]) {
            range.EPS[1] = item.EPS;
        }
        if (item.EPSForecast < range.EPSForecast[0]) {
            range.EPSForecast[0] = item.EPSForecast;
        } else if (item.EPSForecast > range.EPSForecast[1]) {
            range.EPSForecast[1] = item.EPSForecast;
        }
        if (item.revenue < range.revenue[0]) {
            range.revenue[0] = item.revenue;
        } else if (item.revenue > range.revenue[1]) {
            range.revenue[1] = item.revenue;
        }
        if (item.revenueForecast < range.revenueForecast[0]) {
            range.revenueForecast[0] = item.revenueForecast;
        } else if (item.revenueForecast > range.revenueForecast[1]) {
            range.revenueForecast[1] = item.revenueForecast;
        }
    })



    //筛选出包括预测值在内的最大值最小值
    if (range.EPS[0] > range.EPSForecast[0]) {
        range.EPS[0] = range.EPSForecast[0]
    }
    if (range.EPS[1] < range.EPSForecast[1]) {
        range.EPS[1] = range.EPSForecast[1]
    }
    if (range.revenue[0] > range.revenueForecast[0]) {
        range.revenue[0] = range.revenueForecast[0]
    }
    if (range.revenue[1] < range.revenueForecast[1]) {
        range.revenue[1] = range.revenueForecast[1]
    }
    delete range.EPSForecast;//删除无用数据
    delete range.revenueForecast;

    //以下为了是y轴表现一致 
    if (//如果eps和revenue最大值最小值同时在轴的一侧 
        (range.EPS[0] >= 0 && range.EPS[1] >= 0 && range.revenue[0] >= 0 && range.revenue[1] >= 0) ||
        (range.EPS[0] <= 0 && range.EPS[1] <= 0 && range.revenue[0] <= 0 && range.revenue[1] <= 0)
    ) {

        //不做任何处理 直接使用这个数据范围即可
    } else if ((range.EPS[0] * range.EPS[1] < 0) || (numFixed(range.revenue[0]) * numFixed(range.revenue[1]) < 0)) {//最小值最大值是否符号不同
        let a = range.EPS[0] * range.EPS[1];
        let b = numFixed(range.revenue[0]) * numFixed(range.revenue[1]);
        switch (true) {
            case a <= 0 && b >= 0://eps符号不同  revenue符号相同
                if (range.revenue[1] >= 0) {
                    range.revenue[0] = range.revenue[1] * range.EPS[0] / range.EPS[1];
                } else {
                    range.revenue[1] = range.revenue[0] * range.EPS[1] / range.EPS[0];
                }
                break;
            case a >= 0 && b <= 0://eps符号相同 revenue符号不同
                if (range.EPS[1] >= 0) {
                    range.EPS[0] = range.EPS[1] * range.revenue[0] / range.revenue[1];
                } else {
                    range.EPS[1] = range.EPS[0] * range.revenue[1] / range.revenue[0];
                }
                break;
            default: {//符号都不同
                let a = Math.abs(range.EPS[0]) / Math.abs(range.EPS[1]);
                let b = Math.abs(range.revenue[0]) / Math.abs(range.revenue[1]);
                if (Math.abs(a - 1) < Math.abs(b - 1)) {
                    if (b >= 1) {
                        range.revenue[1] = range.revenue[0] * range.EPS[1] / range.EPS[0];
                    } else {
                        range.revenue[0] = range.revenue[1] * range.EPS[0] / range.EPS[1];
                    }
                } else {
                    if (a >= 1) {
                        range.EPS[1] = range.EPS[0] * range.revenue[1] / range.revenue[0];
                    } else {
                        range.EPS[0] = range.EPS[1] * range.revenue[0] / range.revenue[1];
                    }
                }
            }
                break;
        }

    } else {//这种情况使y轴0坐标居中即可
        if (Math.abs(range.EPS[0]) > Math.abs(range.EPS[1])) {
            range.EPS[1] = -range.EPS[0]
        } else {
            range.EPS[0] = -range.EPS[1]
        }
        if (Math.abs(range.revenue[0]) > Math.abs(range.revenue[1])) {
            range.revenue[1] = -range.revenue[0]
        } else {
            range.revenue[0] = -range.revenue[1]
        }
    }
    return range;
}



export default Chart