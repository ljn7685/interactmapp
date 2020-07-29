import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import { changeTitleAction } from '../actions';

import { connect } from 'react-redux';
class ActivityCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
/**
 * 去创建页面的页面
 * @param {*} value 
 */
    goToCreatePage = (value)=>{
        console.log('dddd');
        this.props.changeTitleAction(value, 'create')
    }
/**
 * 帮助文档
 */
goToYuque = ()=>{
    my.qn.navigateToWebPage({
        url: "https://www.yuque.com/books/share/32a46a84-dd07-468e-b1c3-bc648face3de/gwdtvg"
    });
}

    render() {
        const { changeTitleAction } = this.props;
        return (
            <View className='activity-box'>
                {/* 小模块 */}
                <View className='activity-card'>
                    <View className='activity-title'>丘比特之箭</View>
                    <View className='activity-tips'>
                        <View className='tip'>提升关注</View>
                        <View className='tip'>粉丝拉新</View>
                    </View>
                    <View className='instructions'>
                        <View className='instructions-title'>玩法说明：</View>
                        <View className='instructions-info'>1.买家通过参与游戏，胜利后获得优惠券</View>
                        <View className='instructions-info'>2.买家通过关注店铺获取游戏机会，有效提升店铺粉丝量，方便后期深度运营</View>
                        <View className='instructions-info'>3.设置的奖品越吸引人，买家的参与度就会越高哦</View>
                    </View>
                    <View className='activity-bottom'>
                        <View className='create-activity' onClick={changeTitleAction.bind(this,'创建丘比特之箭活动', 'create')}>立即创建</View>
                        <View className='help' onClick={this.goToYuque}>
                            <View className='icno-help iconfont'>&#xe6b5;</View>
                            <View className='txt-help'>帮助文档</View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

//将store里面的值映射为props

const mapDispatchToProps = {
    changeTitleAction
}
export default connect(state => state.hotReducer, mapDispatchToProps)(ActivityCard);
