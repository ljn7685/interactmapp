import React, { Component } from 'react';
import { Text, View, Button } from '@tarojs/components';
import './index.scss';

/**
 * 翻页组件
 */
class TurnPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View className='all-activity-bottom'>
                <View className='pre-page' onClick={this.props.onPageNoChange.bind(this,'up')}>上一页</View>
                <View className='next-page' onClick={this.props.onPageNoChange.bind(this,'down')}>下一页</View>
            </View>
        );
    }
}

export default TurnPage;
