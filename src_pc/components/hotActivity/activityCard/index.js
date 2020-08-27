import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import { changeTitleAction, initActivityDataAction } from '../actions';


import { connect } from 'react-redux';

class ActivityCard extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    /**
     * 帮助文档
     */
    goToYuque = () => {
        my.qn.navigateToWebPage({ url: "https://www.yuque.com/xujingyi/kb/ufwevl" });
    }
    goToCreatePage = (title, titleType) => {
        const { changeTitleAction, initActivityDataAction } = this.props;
        changeTitleAction(title, titleType);
        initActivityDataAction();
    }

    render () {

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
                        <View className='instructions-info'>2.买家通过关注店铺/收藏商品/分享店铺，获取游戏机会，全面提升店铺粉丝/销量，引导用户分享裂变，轻松获取精准定位</View>
                        <View className='instructions-info'>3.设置的奖品越吸引人，买家的参与度就会越高哦</View>
                    </View>
                    <View className='activity-bottom'>
                        <View className='create-activity' onClick={this.goToCreatePage.bind(this, '创建丘比特之箭活动', 'hotActivity#create')}>立即创建</View>
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

// 将store里面的值映射为props

const mapDispatchToProps = {
    changeTitleAction,
    initActivityDataAction,
};
export default connect(state => state.hotReducer, mapDispatchToProps)(ActivityCard);
