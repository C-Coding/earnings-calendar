import React, { PureComponent } from 'react';

import s from './App.less';

import EarningsCalendar from './modules/EarningsCalendar';//财报日历模块
import StockDetail from './modules/StockDetail';//具体数据模块
import Search from './modules/Search';//搜索模块

import { Tabs } from 'antd';



const TabPane = Tabs.TabPane;


class App extends PureComponent {
    constructor() {
        super();

        this.state = {
            activeKey: 'EarningsCalendar',//必须为字符串形式 
            panes: [{ title: '财报日历', content: (<EarningsCalendar stockSelectedFn={this.stockSelectedFn} />), key: 'EarningsCalendar', closable: false }]
        };

    }


    stockSelectedFn = (pairId, name) => {//股票选择函数 用于新增tab页或跳转tab
        if (typeof pairId !== 'string') {
            pairId = String(pairId);
        }
        let panes = [...this.state.panes];//panes副本
        for (let i = 0; i < panes.length; i++) {
            if (pairId === panes[i].key) {//已存在tab 直接进入
                this.setState({
                    activeKey: pairId
                })
                return;
            }
        }

        panes.push({
            title: name, content: (<StockDetail pairId={pairId} />), key: pairId
        })
        this.setState({
            activeKey: pairId,
            panes
        })
    }

    // tabChangeFn = (activeKey) => {//tab页change
    //     this.setState({ activeKey });
    // }

    tabEditFn = (targetKey, action) => {
        if (action === 'remove') {//tab执行删除
            this.tabRemoveFn(targetKey);
        }
    }

    tabRemoveFn = (targetKey) => {//tab页关闭
        const panes = [...this.state.panes];
        let targetIndex;
        for (let i = 1; i < panes.length; i++) {
            if (panes[i].key === targetKey) {
                targetIndex = i;
                panes.splice(i, 1);
                break;
            }
        }
        this.setState({
            activeKey: panes[targetIndex] ? panes[targetIndex].key : panes[0].key,
            panes
        })
    }


    render() {
        return (
            <div className={s.App}>
                <div className={s.container}>

                    <Search className={'1231231'} stockSelectedFn={this.stockSelectedFn} />

                    <div className={s.tabContainer}>
                        <Tabs
                            hideAdd
                            onChange={this.tabChangeFn}
                            activeKey={this.state.activeKey}
                            type="editable-card"
                            onEdit={this.tabEditFn}
                        >
                            {
                                this.state.panes.map(pane => {
                                    return (
                                        <TabPane tab={pane.title} key={pane.key} closable={pane.closable} className={s.tabContent}>
                                            {pane.content}
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
