import React, { Component } from 'react';
import { Text, View, Button } from '@tarojs/components';
import './index.scss';


class ActivityData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }

    dataContentTip = () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        return (
            <View>
                {
                    data.map(() => {
                        return (
                            <View className='data-content-tip'>
                                <View className='tip-date'>2020-07-13</View>
                                <View className='tip-num'>999999</View>
                                <View className='tip-join'>8787</View>
                                <View className='tip-follw'>5656</View>
                                <View className='tip-reward'>1212</View>
                            </View>
                        )
                    })
                }
                <View className='data-content-bottom'>
                    <View className='pre-page end-page'>上一页</View>
                    <View className='next-page'>下一页</View>
                </View>

            </View>

        )
    }

    emptyPageData = () => {
        return (
            <View className='empty-data'>
                <View className='empty-data-icno'>ppqqopopopopo</View>
                <View className='empty-data-txt'>暂无数据</View>
            </View>
        )
    }

    render() {
        const { isShow } = this.state;
        return (
            <View className='activity-data-box'>
                {
                    !isShow && this.emptyPageData()
                }
                {
                    isShow && <View>
                        <View className='data-top'>
                            <View className='data-date'>日期</View>
                            <View className='come'>进入活动页面人数</View>
                            <View className='join'>参与人数</View>
                            <View className='follw'>关注店铺人数</View>
                            <View className='reward'>领取奖励人数</View>
                        </View>
                        <View className='data-content'>
                            <View className='total-box'>
                                <View className='total-data'>总计</View>
                                <View className='total-num'>9999999</View>
                                <View className='total-join'>999999</View>
                                <View className='total-follw'>999999</View>
                                <View className='total-reward'>999999</View>
                            </View>
                            {
                                this.dataContentTip()
                            }
                        </View>
                    </View>
                }

            </View>
        );
    }
}

export default ActivityData;
