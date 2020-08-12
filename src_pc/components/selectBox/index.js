import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';

// 下拉框的选项
export const selectItem = ['全部', '进行中', '已结束', '未开始'];

/**
 * 下拉框组件
 */
class SelectBox extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isShowSelect: false,
            status: '全部',
        };
    }
    /**
     * 下拉框的样式控制
     * @param {*} value 
    */
    selectStatu = (value, index) => {
        if (value === 'pullDown') {
            this.setState({ isShowSelect: !this.state.isShowSelect });
        } else {
            this.setState({
                isShowSelect: !this.state.isShowSelect,
                status: value,
            });
            this.props.changeStatu(index);
        }
    }

    render () {
        const { isShowSelect, status } = this.state;
        return (
            <View className='select-box'>
                <View className='selected' onClick={this.selectStatu.bind(this, 'pullDown')}>
                    <View className='select-txt'>{status}</View>
                    <View className='select-icno iconfont'>&#xe642;</View>
                </View>

                <View className={`select-down-box ${isShowSelect ? 'show-select' : 'no-border'} `}>
                    {
                        selectItem.map((item, index) => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <View className='select-item' onClick={this.selectStatu.bind(this, item, index)}>
                                    <View className='sure-icno iconfont' style={{ opacity: `${status === item ? '1' : '0'}` }}>&#xe613;</View>
                                    <View className='item-txt'>{item}</View>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        );
    }
}

export default SelectBox;
