import React, { Component } from 'react';
import { Text, View, Button, Input } from '@tarojs/components';
import './index.scss';
import moment from 'moment';
import { changeTitleAction } from '../actions';
import { isEmpty } from '../../utils/index';
import Taro from '@tarojs/taro';
import { api } from '../../../public/util/api';

import { connect } from 'react-redux';

var plugin = requirePlugin("myPlugin"); 
//这个bridge用于和插件进行数据通信 
const bridge = {
  bizCode: "3000000025552964", 
//此处输入想配置的业务身份（消费者端appid）  
//这个方法用于获取插件中用户选择的奖池ID  
  getCheckBenefitID({ ename, poolID }) {
     console.log(poolID, ename); //此处可以使用云数据库接口或者云函数接口获取ename,用于后续接口调用  
  } 
} 
@connect(({ hotReducer }) => ({
    hotReducer
}), (dispatch) => ({
    changeTitleAction(title, activityID) {
        dispatch(changeTitleAction(title, activityID))
    }
}))

class CreatePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            args: {
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().add(7, 'days').format("YYYY-MM-DD"),
                gameNumber: 1,
                activeName: '',
                subTitle: ''
            },
        }
        this.cupon = ''; //优惠卷
        this.activeUrl = 'http://localhost/interactive/creatInteract'; //活动创建成功后的地址

        this.isEdit = false; //是否是编辑页面
    }
    componentWillMount(){
        console.log('componentWillMount', this.props.hotReducer);
        //如果是修改或者复制活动的。为了让input框检测到从reducer里获取到的值
        if(!isEmpty(this.props.hotReducer.operType)){
            let newArgs = Object.assign({}, this.state.args);
            newArgs.activeName = this.props.hotReducer.activityData[0].active_name;
            newArgs.subTitle = this.props.hotReducer.activityData[0].sub_title;
            newArgs.startDate = this.props.hotReducer.activityData[0].start_date.substring(0,10);
            newArgs.endDate = this.props.hotReducer.activityData[0].end_date.substring(0,10);
            newArgs.gameNumber = this.props.hotReducer.activityData[0].game_number;
            this.cupon = this.props.hotReducer.activityData[0].active_rewards;
            this.activeUrl = this.props.hotReducer.activityData[0].active_url;
            this.setState({
                args: newArgs
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
                break;
            case 'gameNumber':
                newArgs.gameNumber = e.target.value;
                break;
        }
        this.setState({
            args: newArgs
        })
    }
    /**
     * 选择优惠券类型
     * @param {*} values 
     */
    choice = (values) => {
        console.log('点击优惠卷了', values);
        this.cupon = values;
    }
    /**
     * 跳转优惠券配置页面
     * @param {*} type 
     */
    navigateToPlugin=()=> {
        console.log('点击点击点击')
        my.navigateTo({  url: 'plugin://myPlugin/orightindex-page',  });  
     }
    /**
     * 点击创建按钮
     */

    createActivity = async (type) => {
        console.log('dededede', this.props.hotReducer)
       console.log('dededede', this.props.hotReducer.activityID)
        let operationType = 2;
        if (type == 'sure') {
            //operationType  1-添加新的活动   2-修改活动
            operationType = 1;
        }
        let newArgs = Object.assign({}, this.state.args);
        console.log('newArgsObject', newArgs);
        if (isEmpty(newArgs.activeName) || isEmpty(newArgs.subTitle) || isEmpty(newArgs.startDate) || isEmpty(newArgs.endDate) || isEmpty(this.cupon)) {
            Taro.showToast({
                title: '必填项不能为空',
                duration: 2000
            })
            return;
        }
        //添加参数
        newArgs.activeRewards = this.cupon; //优惠卷
        newArgs.operationType = operationType;//操作类型
        newArgs.activeUrl = this.activeUrl;//活动地址
        newArgs.activeID = this.props.hotReducer.activityID;
        if (this.matchTime(newArgs.startDate) && this.matchTime(newArgs.endDate) && this.matchNum(newArgs.gameNumber)) {
            if (moment(newArgs.endDate).unix() < moment(newArgs.startDate).unix()) {
                console.log('开始时间不能大于结束时间')
                Taro.showToast({
                    title: '开始时间不能大于结束时间',
                    duration: 2000
                })
                return
            }
            console.log('newArgs', newArgs)
            let data = await this.createActivityApi(newArgs);
            console.log('dededeedededede9090', data)
            if (data.code == 200) {
                console.log('qweqweq', data)
                this.props.changeTitleAction('活动创建成功')
            }
        }
    }
    /**
     * 放弃修改，回到活动管理
     *  
     */
    giveUpEdit =()=>{
        this.props.changeTitleAction('活动管理');
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
            Taro.showModal({
                title: '请输入正确的时间格式，如‘2020-01-01'
            })
            return false;
        }
        let time = new Date(res[0]);//转成时间戳
        let result = (time.getFullYear() == res[1] && (time.getMonth() + 1) == res[3] && time.getDate() == res[5]);
        if (!result) {
            console.log('请输入正确的时间');
            Taro.showModal({
                title: '请输入正确的时间'
            })
            return false;
        }
        return true;
    }
    /**
     * 校验是不是非负整数
     * @param {*} value 
     */

    matchNum = (value) => {
        console.log('校验活动次数', value)
        var regPos = /^\d+$/; // 非负整数
        if (regPos.test(value)) {
            return true
        } else {
            console.log('请输入非负整数');
            Taro.showToast({
                title: '活动次数为非负整数',
                duration: 2000
            })
            return false;
        }
    }
    /**
     *创建活动，修改活动
     * @param {*} args 
     */
    createActivityApi = (args) => {
        return new Promise((resolve, reject) => {
            api({
                apiName: 'aiyong.interactb.activity.create',
                method: '/interactive/creatInteract',
                args: args,
                callback: res => {
                    console.log('~~~~~~~sssddd~~sssss~~~~~~~~~~~', res)
                    resolve(res);

                },
                errCallback: err => {
                    console.log('dssdddwww', err)
                    reject(err)
                }
            })
        })
    }
    /**
     * 优惠卷的样式
     */
    couponStyle =()=>{
        return(
            <View className='coupon-box-content'>
                <View className='coupon-top'>
                    <View className='coupon-price'>10元</View>    
                    <View className='coupon-info'>
                        <View className='info-rule'>满<Text>200</Text>元可用</View>
                        <View className='info-limit'>发行量1000张</View>
                    </View>
                </View> 
                <View className='coupon-time'>截止日期：2020-08-08 23:23:45</View>
            </View>
        )
    }

    render() {
        const { args } = this.state;
        const {activityData} = this.props.hotReducer;
        console.log('22121212', activityData)
        return (
            <View className='create-page'>
                <View className='name-box'>
                    <Text className='name-text'>活动名称</Text>
                    <Input className='name-input' type='text' maxlength='16' value={args.activeName} onInput={(e) => { this.inputChange('name', e) }} />
                    <Text className='name-num'>{args.activeName.length}/16</Text>
                    <Text className='name-memo'>备忘用，不展示给买家</Text>
                </View>
                <View className='name-box'>
                    <View className='name-text'>&emsp;副标题</View>
                    <Input className='name-input' type='text' maxlength='16' value={args.subTitle} onInput={(e) => { this.inputChange('title', e) }} />
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
                    <Input type='number' className='res-input' value={args.gameNumber} onInput={(e) => { this.inputChange('gameNumber', e) }} />
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
                        <View className='coupon-jump' onClick={this.navigateToPlugin}>此处应该用个组件</View>
                        <View>
                            {/* {this.couponStyle()} */}
                        </View>
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
                    {
                        this.props.hotReducer.title == '创建丘比特之箭活动' && <View className='sure-btu' onClick={this.createActivity.bind(this, 'sure')}>确认创建活动</View>
                    }
                    {
                        this.props.hotReducer.title == '修改丘比特之箭活动' && <View className='edit-box'>
                            <View className='sure-btu' onClick={this.createActivity.bind(this, 'edit')}>确认修改活动</View>
                            <View className='give-up' onClick={this.giveUpEdit}>放弃修改</View>
                        </View>
                    }

                </View>

            </View>
        );
    }
}

export default CreatePage;
