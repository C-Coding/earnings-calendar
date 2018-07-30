import React, { PureComponent } from 'react';
import moment from 'moment';
import { Popover, Icon, DatePicker, Spin, Alert } from 'antd';

import FlagIcon from '@/components/FlagIcon/index.jsx'
import TableData from './TableData.jsx';

import CountrySelector from './CountrySelector.jsx';

import s from './index.less';

import { CountryList, CountryObj } from '@/lib/CountryMap.js';

const { RangePicker } = DatePicker;





class EarningsCalendar extends PureComponent {
    constructor(props) {
        super(props);

        let countryComfirmList;
        try {
            countryComfirmList = JSON.parse(window.localStorage.countryComfirmList).map(
                function (item) { return CountryObj[item] }
            );
        } catch (error) {
            delete window.localStorage.countryComfirmList;
            countryComfirmList = [CountryList[0], CountryList[1], CountryList[2]];
        }


        this.state = {
            loading: true,
            data: [],//财报日历数据

            datePicker: [moment(), moment()],//默认日期
            datePickerOpen: false,//日期选择器是否显示
            datePickerError: null,//日期选择器错误提示

            countryComfirmList //默认选中国家
        }
    }
    componentDidMount() {
        this.getData(
            this.state.datePicker[0],
            this.state.datePicker[0],
            this.state.countryComfirmList
        );
    }




    getData(dateFrom, dateTo, countryComfirmList) {//获取数据
        this.setState({
            loading: true
        })
        this.$api.earningsCalendar(
            dateFrom.format('YYYY-MM-DD'),
            dateTo.format('YYYY-MM-DD'),
            countryComfirmList.map(function (item) { return item.id })
        ).then(d => {
            this.setState({
                loading: false,
                data: d.data.data
            })
        })

    }


    datePickerChangeFn = (v) => {//日期选择器change函数 获取数据
        let from = v[0];
        let to = v[1];
        if (to.diff(from, 'days') + 1 > 7) {
            this.setState({
                datePickerError: '暂不支持查看超过1周的数据'
            })
        } else {
            this.setState({
                datePickerError: null,
                datePicker: v,
                loading: true
            });

            setTimeout(() => {
                this.getData(v[0], v[1], this.state.countryComfirmList)
            }, 600);
        }
    }
    datePickerOpenChange = (status) => {//日期选择器显示change
        this.setState({}, () => {
            if (this.state.datePickerError === null) {
                this.setState({
                    datePickerOpen: status
                })
            }
        })
    }

    countryComfirmFn = (countryComfirmList) => {//确认选择的国家列表同时获取数据
        this.getData(this.state.datePicker[0], this.state.datePicker[1], countryComfirmList)
        this.setState({
            countryCheckedShow: false,
            countryComfirmList
        });
        window.localStorage.countryComfirmList = JSON.stringify(countryComfirmList.map(function (item) { return item.id }));
    }

    render() {
        return (
            <Spin size="large" spinning={this.state.loading}>
                <div className={s.earningsCalendar}>
                    <RangePicker
                        allowClear={false}
                        defaultValue={this.state.datePicker}
                        open={this.state.datePickerOpen}
                        onChange={this.datePickerChangeFn}
                        onOpenChange={this.datePickerOpenChange}
                        renderExtraFooter={() => {
                            let msg = this.state.datePickerError;
                            if (msg) {
                                return (
                                    <Alert className={s.datePickerAlert} message={msg} type="warning" showIcon />
                                )
                            } else {
                                return null
                            }
                        }}
                    />


                    <Popover
                        placement="bottomRight"
                        title="请选择您需要查看财报的地区"
                        onVisibleChange={(status) => {
                            this.setState({
                                countryCheckedShow: status
                            })
                        }}
                        visible={this.state.countryCheckedShow}
                        content={<CountrySelector countryComfirmList={this.state.countryComfirmList} countryComfirmFn={this.countryComfirmFn} />}
                    >
                        <div className={s.countrySelectorBtn}>

                            {this.state.countryComfirmList.map(function (item, index) {
                                if (index <= 3) {
                                    return (
                                        <FlagIcon key={item.id} className={s.item} code={item.code} />
                                    )
                                } else if (index === 4) {
                                    return (<span key={'more'}>...</span>)
                                } else {
                                    return null;
                                }
                            })}
                            <Icon type="down" />
                        </div>
                    </Popover>


                    <TableData data={this.state.data} stockSelectedFn={this.props.stockSelectedFn} />
                </div>
            </Spin>
        )
    }
}

export default EarningsCalendar