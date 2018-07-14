import React, { Component } from 'react';



import s from './index.less'

class Options extends Component {
    constructor(props) {
        super(props);//传入data 数据数组 key map使用的key值 字符串

        this.state = {
            activeIndex: null
        }
    }


    up() {
        if (this.state.activeIndex) {//为null不执行 为0不执行
            const activeIndex = this.state.activeIndex - 1;
            this.setState({
                activeIndex
            })
        }
    }
    down() {
        if (!this.props.data || this.props.data.length === 0) {
            return;
        }
        let activeIndex = this.state.activeIndex;
        if (activeIndex === null) {
            activeIndex = 0;
        } else if (activeIndex === this.props.data.length - 1) {
            return;
        } else {
            activeIndex++;
        }

        this.setState({
            activeIndex
        })

    }
    getActiveIndex() {
        if (this.state.activeIndex === null) {
            return 0;
        } else {
            return this.state.activeIndex
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                activeIndex: null
            })
        }
        return true;
    }



    render() {
        if (!this.props.data || this.props.data.length === 0) {
            return null;
        } else {
            return (
                <div className={`${this.props.className} ${s.OptionsBox}`}>
                    {
                        this.props.data.map((item, index) => {
                            return (
                                <div
                                    onMouseEnter={() => {
                                        this.setState({
                                            activeIndex:index
                                        })
                                    }}
                                    key={item[this.props.keyName]}
                                    className={`
                                        ${s.selectItemBox}
                                        ${this.state.activeIndex === index ? s.active : ''}
                                    `}
                                >
                                    {this.props.render(item)}
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    }
}

export default Options;