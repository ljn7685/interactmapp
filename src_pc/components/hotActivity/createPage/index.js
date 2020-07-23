import React, { Component } from 'react';
import { Text, View, Button, Input } from '@tarojs/components';
import './index.scss';
import moment from 'moment';
import { changeTitleAction } from '../actions';

import { connect } from 'react-redux';

@connect(({hotReducer})=>({
    hotReducer
}), (dispatch) => ({
    changeTitleAction (title, titleType) {
        dispatch(changeTitleAction(title, titleType))
      }
  }))

class CreatePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            args: {
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().add(7, 'days').format("YYYY-MM-DD"),
                gameNumber: 0,
                activeName:'',
                subTitle:''
            },
            isEdit: false
        }
    }
    componentDidMount(){
        if(this.props.hotReducer.activityData.length > 0){
            this.setState({
                isEdit: true
            })
        }
    }
    /**
     * 获取输入框的值
     * @param {*} type 
     * @param {*} e 
     */
    inputChange = (type, e) => {
        let newArgs = Object.assign({}, this.state.args);
        switch (type) {
            case 'name':
                newArgs.activeName = e.target.value;
                break;
            case 'title':
                newArgs.subTitle = e.target.value;
                break;
            case 'startTime':
                newArgs.startDate = e.target.value;
                break;
            case 'endTime':
                newArgs.endDate = e.target.value;
            case 'gameNumber':
                newArgs.gameNumber = e.target.value;
        }
        this.setState({
            args: newArgs
        })
    }
    /**
     * 点击创建按钮
     */

    createActivity =()=>{
        console.log('newArgs',newArgs)
        let newArgs = Object.assign({}, this.state.args)
        if(this.matchTime(newArgs.startDate) && this.matchTime(newArgs.endDate) && this.matchNum(newArgs.gameNumber)){
            if(moment(newArgs.endDate).unix() < moment(newArgs.startDate).unix()){
                console.log('开始时间不能大于结束时间')
                return
            }
            console.log('newArgs',newArgs)
            this.props.changeTitleAction('活动创建成功')
        }
    }
    /**
     * 校验时间是否正确
     * @param {*} type 
     */
    matchTime = (type) => {
        let res = type.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);
        console.log('ss', res)
        if (res == null) {
            console.log('请输入正确的时间格式，如‘2020-01-01');
            return false;
        }
        let time = new Date(res[0]);//转成时间戳
        let result = (time.getFullYear() == res[1] && (time.getMonth() + 1) == res[3] && time.getDate() == res[5]);
        if (!result) {
            console.log('请输入正确的时间');
            return false;
        }
        return true;
    }
    /**
     * 校验是不是非负整数
     * @param {*} value 
     */

    matchNum = (value) => {
        var regPos = /^\d+$/; // 非负整数
        if(regPos.test(value)){
            return true
        }else{
            console.log('请输入非负整数');
            return false;
        }
    }




    render() {
        const { args, isEdit } = this.state;
        return (
            <View className='create-page'>
                <View className='name-box'>
                    <Text className='name-text'>活动名称</Text>
                    <Input className='name-input' type='text' maxlength='16' onInput={(e) => { this.inputChange('name', e) }} />
                    <Text className='name-num'>{args.activeName.length}/16</Text>
                    <Text className='name-memo'>备忘用，不展示给买家</Text>
                </View>
                <View className='name-box'>
                    <View className='name-text'>&emsp;副标题</View>
                    <Input className='name-input' type='text' maxlength='16' onInput={(e) => { this.inputChange('title', e) }} />
                    <Text className='name-num'>{args.subTitle.length}/16</Text>
                </View>
                <View className='activity-time'>
                    <View className='time-txt'>活动时间</View>
                    <Input className='time-input' value={args.startDate} onInput={(e) => { this.inputChange('startTime', e) }} />
                    <Text className='time-to'>至</Text>
                    <Input className='time-input' value={args.endDate} onInput={(e) => { this.inputChange('endTime', e) }} />
                </View>
                <View className='res-box'>
                    <Text className='res-text'>复活次数</Text>
                    <Input type='number' className='res-input' onInput={(e) => { this.inputChange('gameNumber', e) }} />
                    <Text className='unit'>次</Text>
                    <Text className='res-memo'>买家关注店铺后，游戏失败可重新挑战次数</Text>
                </View>
                <View className='coupon-box'>
                    <View className='coupon-top'>
                        <View className='coupon-title'>活动奖励</View>
                        <View className='coupon'>优惠券</View>
                        <View className='refresh'>刷新</View>
                    </View>
                    <View className='warn-bar'>
                        <View className='warn-icno'>!!</View>
                        <View className='warn-txt'>优惠券为游戏胜利时发放，设置中奖率不得低于99.99%</View>
                    </View>
                    <View className='coupon-img-box'>
                        此处应该用个组件
                    </View>
                </View>
                <View className='rules-box'>
                    <View className='rules-des'>规则说明</View>
                    <View className='rules-content'>
                        <Text>活动时间：2020年7月13日 22:22 - 2020年7月20日 22:21</Text>
                        <Text>一.活动介绍：</Text>
                        <Text>1.从店铺首页或商品详情页进入丘比特之箭页面即可开始游戏；</Text>
                        <Text>2.活动期间，可通过关注店铺获取游戏次数；</Text>
                        <Text>3.游戏成功，即可获得奖励；</Text>
                        <Text>二.玩法介绍：</Text>
                        <Text>1.向后拉动弓箭，手指离开屏幕弓箭射出，若弓箭触碰到转盘中的其他弓箭则挑战失败；</Text>
                        <Text>2.规定时间内弓箭未使用完毕，则挑战失败；</Text>
                        <Text>三.奖励规则：</Text>
                        <Text>1.优惠券可在卡券包中查看，店铺内购买商品时可使用；</Text>
                        <Text>2.每人每日只可领取一个奖励；</Text>
                    </View>
                </View>
                <View className='create-bottom'>
                    <View className='sure-btu' onClick={this.createActivity}>确认创建活动</View>
                    {
                        isEdit &&  <View className='give-up'>放弃修改</View>
                    }
                </View>

            </View>
        );
    }
}

export default CreatePage;
