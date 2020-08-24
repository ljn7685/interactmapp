import React, { Component } from 'react';
import { View } from '@tarojs/components';
import propTypes from 'prop-types';
import './index.scss';


/**
 * 下拉框组件
 */
class SelectBox extends Component {

    constructor (props) {
        super(props);
        this.state = { isShowSelect: false };
    }
    /**
     * 下拉框的样式控制
     * @param {*} value 
    */
    selectStatu = (value, index) => {
        if (value === 'pullDown') {
            this.setState({ isShowSelect: !this.state.isShowSelect });
        } else {
            this.setState({ isShowSelect: !this.state.isShowSelect });
            this.props.changeStatu(index);
        }
    }

    render () {
        const { isShowSelect } = this.state;
        const { selectItem, selectIndex } = this.props;
        const status = selectItem[selectIndex];
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
SelectBox.defaultProps = { selectIndex: 0, selectItem:[], changeStatu:() => {} };
SelectBox.propTypes = {
    selectIndex: propTypes.number,
    selectItem: propTypes.arrayOf(propTypes.string),
    changeStatu: propTypes.func,
};
export default SelectBox;
