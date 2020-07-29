import React, { Component } from 'react';
import { Text, View, Input } from '@tarojs/components';
import './index.scss';
import moment from 'moment';
import { changeTitleAction, setActivityUrlAction } from '../actions';
import { isEmpty } from '../../utils/index';
import Taro from '@tarojs/taro';
import { api, invokeTop } from '../../../public/util/api';

import { connect } from 'react-redux';

//c端版本号
export const version = '0.0.3';

var plugin = requirePlugin("myPlugin");
let eName;
//这个bridge用于和插件进行数据通信 
const bridge = {
    bizCode: "3000000025552964",
    //此处输入想配置的业务身份（消费者端appid）  
    //这个方法用于获取插件中用户选择的奖池ID  
    getCheckBenefitID({ ename, poolID }) {
        eName = ename;
    }
}
@connect(({ hotReducer }) => ({
    hotReducer
}), (dispatch) => ({
    changeTitleAction(title, titleType) {
        dispatch(changeTitleAction(title, titleType))
    },
    setActivityUrlAction(data) {
        dispatch(setActivityUrlAction(data))
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
                subTitle: '',
            },
            couponData: [],//优惠券信息
        }
        this.cupon = {}; //优惠卷
        this.activeUrl = `https://m.duanqu.com?_ariver_appid=3000000012505562&nbsv=${version}&nbsource=debug&nbsn=TRIAL&_mp_code=tb&query=activeID%3D`; //活动创建成功后的地址
        this.isEdit = false; //是否是编辑页面
    }
    componentWillMount() {
        const { hotReducer } = this.props;
        const activityData = this.props.hotReducer.activityData[0];
        //如果是修改或者复制活动的。为了让input框检测到从reducer里获取到的值
        if (!isEmpty(hotReducer.operType)) {
            let newArgs = Object.assign({}, this.state.args);
            newArgs.activeName = activityData.active_name;
            newArgs.subTitle = activityData.sub_title;
            newArgs.gameNumber = activityData.game_number;
            //是修改的话，就需要时间和优惠券信息
            if (hotReducer.operType == '修改') {
                newArgs.startDate = activityData.start_date.substring(0, 10);
                newArgs.endDate = activityData.end_date.substring(0, 10);
                this.cupon = JSON.parse(activityData.active_rewards);
                this.activeUrl = activityData.active_url;
                this.setState({
                    args: newArgs,
                    couponData: JSON.parse(activityData.active_rewards).datas
                })
            } else {
                //复制活动的就不需要时间和优惠券信息
                this.setState({
                    args: newArgs
                })
            }
        }
    }
    componentDidMount() {
        //获取优惠券信息的重要一步
        plugin.setBridge(bridge);
    }
    /**
     * 获取输入框的值
     * @param {*} type 
     * @param {*} e 
     */
    inputChange = (type, e) => {
        let newArgs = Object.assign({}, this.state.args);
        newArgs[type] = e.target.value;
        this.setState({
            args: newArgs
        })
    }
    /**
     * 跳转优惠券配置页面
     * @param {*} type 
     */
    navigateToPlugin = () => {
        my.navigateTo({
            url:
                'plugin://myPlugin/orightindex-page',
        });
    }
    /**
     * 点击确定按钮
     */
    createActivity = async (type) => {
        let operationType = 2;
        if (type == 'sure') {
            //operationType  1-添加新的活动   2-修改活动
            operationType = 1;
        }
        let newArgs = Object.assign({}, this.state.args);
        if (isEmpty(newArgs.activeName) || isEmpty(newArgs.subTitle) || isEmpty(newArgs.startDate) || isEmpty(newArgs.endDate) || isEmpty(this.cupon)) {
            Taro.showToast({
                title: '必填项不能为空',
                duration: 2000
            })
            return;
        }
        //添加参数
        newArgs.activeRewards = JSON.stringify(this.cupon); //优惠卷
        newArgs.operationType = operationType;//操作类型
        newArgs.activeUrl = encodeURIComponent(this.activeUrl);//活动地址
        newArgs.activeID = this.props.hotReducer.activityID;
        if (this.matchTime([newArgs.startDate, newArgs.endDate]) && this.matchNum(newArgs.gameNumber)) {
            let data = await this.createActivityApi(newArgs);
            if (data.code == 200) {
                if (operationType == 2) {
                    //修改成功后，就回活动管理了
                    this.props.changeTitleAction('活动管理', 'management');
                } else {
                    let activeUrl = this.activeUrl + data.activityId;
                    this.props.changeTitleAction('活动创建成功', 'success');
                    //存一个链接，成功页面要拿到的
                    this.props.setActivityUrlAction(activeUrl);
                }
            }
        }
    }
    /**
     * 放弃修改，回到活动管理
     *  
     */
    giveUpEdit = () => {
        this.props.changeTitleAction('活动管理', 'management');
    }
    /**
     * 获取优惠券的详细信息
     * @param {*} type 
     */
    getCouponData = () => {
        invokeTop({
            api: 'alibaba.benefit.query',
            params: {
                'ename': eName,
                'app_name': 'promotioncenter-3000000025552964'
            },
            callback: res => {
                this.setState({
                    couponData: res.result.datas
                })
                this.cupon = { 'ename': eName, 'datas': res.result.datas }
            },
            errCallback: err => {
                console.log(err)
            }

        })
    }
    /**
     * 校验时间是否正确
     * @param {*} type 
     */
    matchTime = (type) => {
        for (let i = 0; i < type.length; i++) {
            let res = type[i].match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);
            console.log('ss', res)
            if (res == null) {
                Taro.showModal({
                    title: '请输入正确的时间格式，如2020-01-01',
                    showCancel: false,
                    confirmText: '确定'
                })
                return false;
            }
            let time = new Date(res[0]);//转成时间戳
            let result = (time.getFullYear() == res[1] && (time.getMonth() + 1) == res[3] && time.getDate() == res[5]);
            if (!result) {
                Taro.showModal({
                    title: '请输入正确的时间',
                    showCancel: false,
                    confirmText: '确定'
                })
                return false;
            }
        }
        if (moment(type[1]).unix() < moment(type[0]).unix()) {
            Taro.showToast({
                title: '开始时间不能大于结束时间',
                duration: 2000
            })
            return
        }
        return true;
    }
    /**
     * 校验是不是非负整数
     * @param {*} value 
     */

    matchNum = (value) => {
        var regPos = /^\d+$/; // 非负整数
        if (regPos.test(value)) {
            return true
        } else {
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
    couponStyle = () => {
        const { couponData } = this.state;
        let jsx = null;
        console.log('dedededede', couponData)
        return (
            <View className='coupon-mid-box'>
                <View className='coupon-jump' onClick={this.navigateToPlugin}>
                    <View className='iconfont icno-coupon'>&#xe639;</View>
                    <View className='jump-txt'>添加店铺优惠券</View>
                </View>
                {
                    !isEmpty(couponData) && couponData.map((item) => {
                        return (
                            <View className='coupon-box-content'>
                                <View className='coupon-top'>
                                    <View className='coupon-price'>{item.amount / 100}元</View>
                                    <View className='coupon-info'>
                                        <View className='info-rule'>满<Text>200</Text>元可用</View>
                                        <View className='info-limit'>发行量{item.prize_quantity}张</View>
                                    </View>
                                </View>
                                <View className='coupon-time'>截止日期：{item.end_date}</View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    render() {
        const { args } = this.state;
        const { activityData } = this.props.hotReducer;
        console.log('22121212', activityData)
        return (
            <View className='create-page'>
                <View className='name-box'>
                    <Text className='name-text'>活动名称</Text>
                    <Input className='name-input' type='text' maxlength='16' value={args.activeName} onInput={(e) => { this.inputChange('activeName', e) }} />
                    <Text className='name-num'>{args.activeName.length}/16</Text>
                    <Text className='name-memo'>备忘用，不展示给买家</Text>
                </View>
                <View className='name-box'>
                    <View className='name-text'>&emsp;副标题</View>
                    <Input className='name-input' type='text' maxlength='16' value={args.subTitle} onInput={(e) => { this.inputChange('subTitle', e) }} />
                    <Text className='name-num'>{args.subTitle.length}/16</Text>
                </View>
                <View className='name-box'>
                    <View className='time-txt'>活动时间</View>
                    <Input className='time-input' value={args.startDate} onInput={(e) => { this.inputChange('startDate', e) }} />
                    <Text className='time-to'>至</Text>
                    <Input className='time-input' value={args.endDate} onInput={(e) => { this.inputChange('endDate', e) }} />
                </View>
                <View className='name-box'>
                    <Text className='res-text'>复活次数</Text>
                    <Input type='number' className='res-input' value={args.gameNumber} onInput={(e) => { this.inputChange('gameNumber', e) }} />
                    <Text className='unit'>次</Text>
                    <Text className='res-memo'>买家关注店铺后，游戏失败可重新挑战次数</Text>
                </View>
                <View className='coupon-box'>
                    <View className='coupon-top'>
                        <View className='coupon-title'>活动奖励</View>
                        <View className='coupon'>优惠券</View>
                        <View className='refresh' onClick={this.getCouponData}>刷新</View>
                    </View>
                    <View className='warn-bar'>
                        <View className='warn-icno iconfont'>&#xe607;</View>
                        <View className='warn-txt'>优惠券为游戏胜利时发放，设置中奖率不得低于99.99%</View>
                    </View>
                    <View className='coupon-img-box'>
                        <View className='coupon-middle-box'>
                            {this.couponStyle()}
                        </View>
                    </View>
                </View>
                <View className='rules-box'>
                    <View className='rules-des'>规则说明</View>
                    <View className='rules-content'>
                        <Text>活动时间：{args.startDate} - {args.endDate}</Text>
                        <Text>一.活动介绍：</Text>
                        <Text>1.从店铺首页或商品详情页进入丘比特之箭页面即可开始游戏；</Text>
                        <Text>2.活动期间，可通过关注店铺获取游戏次数；</Text>
                        <Text>二.玩法介绍：</Text>
                        <Text>1.向后拉动弓箭，手指离开屏幕弓箭射出，若弓箭触碰到转盘中的其他弓箭则挑战失败；</Text>
                        <Text>2.规定时间内弓箭未使用完毕，则挑战失败；</Text>
                        <Text>3.游戏成功，即可获得奖励；</Text>
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
