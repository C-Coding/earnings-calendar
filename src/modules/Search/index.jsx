import React, { PureComponent } from 'react';

import Options from '@/components/Options/index.jsx';
import FlagIcon from '@/components/FlagIcon'
import { Input, Icon, Spin } from 'antd'

import s from './index.less';




class Search extends PureComponent {
    constructor(props) {
        super(props);

        this.searchOptions = React.createRef();


        this.searchTextTimer = null;

        this.state = {
            searchLoading: false,

            searchText: '',
            searchResult: []
        }
    }

    searchInputFn = (e) => {
        clearInterval(this.searchTextTimer);

        const text = e.target.value;
        this.setState({
            searchText: text
        })

        if (text === '' || /^ *$/.test(text)) {
            this.setState({
                searchResult: []
            })
            return;
        }

        this.searchTextTimer = setTimeout(() => {
            this.setState({
                searchLoading: true
            })
            this.$api.search(text).then(d => {
                if (this.state.searchText !== text) {
                    this.setState({
                        searchLoading: false
                    })
                    return;
                }
                if (d.data.code !== 0) {
                    return;
                }
                d = d.data.data;
                this.setState({
                    searchResult: d,
                    searchLoading: false
                })
            })
        }, 200)

    }


    searchResultSelectFn = (e) => {
        switch (e.keyCode) {
            case 38:
                e.preventDefault();
                this.searchOptions.current.up()
                break;
            case 40:
                e.preventDefault();
                this.searchOptions.current.down()
                break;
            case 13:
                const index = this.searchOptions.current.getActiveIndex()

                const searchResult = this.state.searchResult
                const pairId = searchResult[index].pairId
                const name = searchResult[index].name
                this.props.stockSelectedFn(pairId, name);
                this.setState({
                    searchText: name,
                    searchResult: []
                })
                break;
            default:
                break;
        }
    }




    render() {
        return (
            <div className={s.searchBox}>
                <div className={s.inputBox}>
                    <Input
                        size={'large'}
                        value={this.state.searchText}
                        onInput={this.searchInputFn}
                        placeholder="请输入您要查询的股票名称或代码"
                        onKeyDown={this.searchResultSelectFn}
                        onBlur={() => {
                            setTimeout(() => {
                                this.setState({
                                    searchResult: []
                                })
                            }, 200)
                        }}
                    />
                    <Spin indicator={<Icon type="loading" spin />} className={s.loading} spinning={this.state.searchLoading} />
                </div>


                <Options
                    className={s.optionsBox}
                    ref={this.searchOptions}
                    data={this.state.searchResult}
                    keyName={'pairId'}
                    render={(item) => {
                        return (
                            <div className={s.option}
                                onClick={() => {
                                    this.props.stockSelectedFn(item.pairId, item.name);
                                    this.setState({
                                        searchText: item.name,
                                        searchResult: []
                                    })
                                }} >
                                <span className={`fontGray ${s.code}`}>{item.code}</span>
                                <span className={s.name}>{item.name}</span>
                                <span className={s.flag}>
                                    <FlagIcon className={s.flag} code={item.countryCode} />
                                </span>
                            </div>
                        )
                    }}
                />
            </div>
        )
    }
}

export default Search;