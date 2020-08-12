import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';

/**
 * 翻页组件
 */
class TurnPage extends Component {

    constructor (props) {
        super(props);
        this.state = {};
    }
    onPageNoChange=(type) => {
        let pageNo = this.props.pageNo;
        if (type === 'up') {
            if (pageNo === 1) {
                Taro.showToast({
                    title: '已经是最前页了',
                    duration: 2000,
                });
                return;
            }
            pageNo -= 1;
        } else {
            pageNo += 1;
        }
        this.props.onPageNoChange(pageNo);
    }

    render () {
        return (
            <View className='all-activity-bottom'>
                <View className='pre-page' onClick={this.onPageNoChange.bind(this, 'up')}>上一页</View>
                <View className='next-page' onClick={this.onPageNoChange.bind(this, 'down')}>下一页</View>
            </View>
        );
    }
}

export default TurnPage;
