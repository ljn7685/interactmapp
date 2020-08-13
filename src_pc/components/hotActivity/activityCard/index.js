import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import { changeTitleAction, changeActivityDataAction } from '../actions';
import moment from 'moment';
import { isEmpty } from '../../utils/index';
import { getUserInfo } from '../../../public/util/userInfoChanger';

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
        const { changeTitleAction, changeActivityDataAction } = this.props;
        changeTitleAction(title, titleType);
        changeActivityDataAction({
            'activeName': '',
            'subTitle': '',
            'startDate': moment().format("YYYY-MM-DD"),
            'endDate': moment().add(7, 'days').format("YYYY-MM-DD"),
            'gameNumber': 0,
            'couponData': '',
            'activeUrl': `https://m.duanqu.com?_ariver_appid=3000000012505562&nbsv=${isEmpty(getUserInfo().cVersion) ? '0.0.14' : getUserInfo().cVersion}&_mp_code=tb&query=activeID%3D`,
            'activeRewards': '',
            'gameConfig':{
                'maxShareNum':3,
                'maxCollectNum':3,
                'goods':[],
            },
        });
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
                        <View className='instructions-info'>2.买家通过关注店铺获取游戏机会，有效提升店铺粉丝量，方便后期深度运营</View>
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
    changeActivityDataAction,
};
export default connect(state => state.hotReducer, mapDispatchToProps)(ActivityCard);
