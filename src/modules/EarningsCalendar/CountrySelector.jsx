import React, { PureComponent } from 'react';

import { Checkbox, Row, Col, Button } from 'antd';

import FlagIcon from '@/components/FlagIcon'

import CountryList from '@/lib/CountryList.json'

import s from './index.less';

const CheckboxGroup = Checkbox.Group;


class CountrySelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            countryCheckedList: this.props.countryComfirmList//国家选择器选择列表

        }
    }

    countryCheckedListInverseFn = () => {
        if (this.state.countryCheckedList.length === 0) {
            this.setState({
                countryCheckedList: CountryList
            })
            return;
        }


        if (this.state.countryCheckedList.length === CountryList.length) {
            this.setState({
                countryCheckedList: []
            })
            return;
        }

        const checkedList = [...this.state.countryCheckedList];
        const arr = CountryList.filter(function (item) {
            for (let i = 0; i < checkedList.length; i++) {
                if (item.id === checkedList[i].id) {
                    checkedList.splice(i, 1);
                    return false;
                }
            }
            return true;
        });
        this.setState({
            countryCheckedList: arr
        })
    }
    render() {
        return (
            <div className={`${s.countrySelectorBox}`}>
                <CheckboxGroup value={this.state.countryCheckedList} className={s.countrySelectorContent} onChange={(arr) => {
                    this.setState({
                        countryCheckedList: arr
                    })
                }}>
                    <Row>
                        {CountryList.map(function (item) {
                            return (
                                <Col span={6} className={s.item} key={item.id}>
                                    <Checkbox value={item}>
                                        <FlagIcon code={item.code} className={s.flag} />
                                        {item.name}
                                    </Checkbox>
                                </Col>
                            )
                        })}
                    </Row>
                </CheckboxGroup>

                <div className={'floatClear'}>
                    <div className={s.countrySelectorControlBox}>
                        <span className={s.all} onClick={() => {
                            this.setState({
                                countryCheckedList: CountryList
                            })
                        }} >全选</span>
                        <span className={s.inverse} onClick={this.countryCheckedListInverseFn} >反选</span>
                    </div>

                    <Button className={s.countrySelectorComfirmBtn} type="primary" size="small" onClick={() => {
                        this.props.countryComfirmFn(this.state.countryCheckedList)
                    }} >确认</Button>
                </div>

            </div>
        )
    }
}


export default CountrySelector