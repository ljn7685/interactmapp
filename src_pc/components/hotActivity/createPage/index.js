import React, { Component } from 'react';
import { Text, View, Input, Image } from '@tarojs/components';
import './index.scss';
import moment from 'moment';
import { changeTitleAction, setActivityUrlAction } from '../actions';
import { isEmpty } from '../../utils/index';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import {createActivityApi} from '../../../public/bPromiseApi/index';
//c端版本号
export const version = '0.0.12';



class CreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            args: {
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().add(7, 'days').format("YYYY-MM-DD"),
                gameNumber: 0,
                activeName: '',
                subTitle: '',
            },
            couponData: [],//优惠券信息
        }
        this.cupon = {}; //优惠卷
        this.activeUrl = `https://m.duanqu.com?_ariver_appid=3000000012505562&nbsv=${version}&_mp_code=tb&query=activeID%3D`; //活动创建成功后的地址
        this.isEdit = false; //是否是编辑页面
    }
    componentWillMount() {
        const { activityData, operType } = this.props;
        //如果是修改或者复制活动的。为了让input框检测到从reducer里获取到的值
        if (!isEmpty(operType)) {
            let newArgs = Object.assign({}, this.state.args);
            newArgs.activeName = activityData[0].active_name;
            newArgs.subTitle = activityData[0].sub_title;
            newArgs.gameNumber = activityData[0].game_number;
            //是修改的话，就需要时间和优惠券信息
            if (operType == '修改') {
                newArgs.startDate = activityData[0].start_date.substring(0, 10);
                newArgs.endDate = activityData[0].end_date.substring(0, 10);
                this.cupon = JSON.parse(activityData[0].active_rewards);
                this.activeUrl = activityData[0].active_url;
                this.setState({
                    args: newArgs,
                    couponData: JSON.parse(activityData[0].active_rewards).poolID
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
        var plugin = requirePlugin("myPlugin");
        //这个bridge用于和插件进行数据通信 
        let self = this;
        const bridge = {
            bizCode: "3000000012505562",//c
            // bizCode: "3000000025552964",//b
            //此处输入想配置的业务身份（消费者端appid）  
            //这个方法用于获取插件中用户选择的奖池ID  
            getCheckBenefitID({ ename, poolID }) {
                console.log(ename, poolID)
                self.cupon = { 'ename': ename, 'poolID': poolID }
                self.setState({
                    couponData: poolID
                })
            }
        }
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
        const { activityID, changeTitleAction, setActivityUrlAction } = this.props;
        let operationType = 2;
        if (type == 'sure') {
            //operationType  1-添加新的活动   2-修改活动
            operationType = 1;
        }
        let newArgs = Object.assign({}, this.state.args);
        if (isEmpty(newArgs.activeName) || isEmpty(newArgs.subTitle) || isEmpty(newArgs.startDate) || isEmpty(newArgs.endDate) || isEmpty(this.state.couponData)) {
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
        newArgs.activeID = activityID;
        if (this.matchTime([newArgs.startDate, newArgs.endDate]) && this.matchNum(newArgs.gameNumber)) {
            let data = await createActivityApi(newArgs);
            if (data.code == 200) {
                if (operationType == 2) {
                    //修改成功后，就回活动管理了
                    changeTitleAction('活动管理', 'management#allActivity');
                } else {
                    let activeUrl = this.activeUrl + data.activityId;
                    changeTitleAction('活动创建成功', 'hotActivity#success');
                    //存一个链接，成功页面要拿到的
                    setActivityUrlAction(activeUrl);
                }
            }
        }
    }
    /**
     * 放弃修改，回到活动管理
     *  
     */
    giveUpEdit = () => {
        this.props.changeTitleAction('活动管理', 'management#allActivity');
    }
    /**
     * 校验时间是否正确
     * @param {*} type 
     */
    matchTime = (type) => {
        for (let i = 0; i < type.length; i++) {
            let res = type[i].match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);
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
    render() {
        const { args, couponData } = this.state;
        const { title } = this.props;
        return (
            <View className='create-page'>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <Text className='name-text'>活动名称</Text>
                    <Input className='name-input' type='text' maxlength='16' value={args.activeName} onInput={(e) => { this.inputChange('activeName', e) }} />
                    <Text className='name-num'>{args.activeName.length}/16</Text>
                    <Text className='name-memo'>备忘用，不展示给买家</Text>
                </View>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <View className='name-text'>&emsp;副标题</View>
                    <Input className='name-input' type='text' maxlength='16' value={args.subTitle} onInput={(e) => { this.inputChange('subTitle', e) }} />
                    <Text className='name-num'>{args.subTitle.length}/16</Text>
                </View>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <View className='time-txt'>活动时间</View>
                    <Input className='time-input' value={args.startDate} onInput={(e) => { this.inputChange('startDate', e) }} />
                    <Text className='time-to'>至</Text>
                    <Input className='time-input' value={args.endDate} onInput={(e) => { this.inputChange('endDate', e) }} />
                </View>
                <View className='name-box'>
                    <Text className='res-text'>&emsp;复活次数</Text>
                    <Input type='number' className='res-input' value={args.gameNumber} onInput={(e) => { this.inputChange('gameNumber', e) }} />
                    <Text className='unit'>次</Text>
                    <Text className='res-memo'>买家关注店铺后，游戏失败可重新挑战次数</Text>
                </View>
                <View className='coupon-box'>
                    <View className='coupon-top'>
                        <Text className='warn-xing'>*</Text>
                        <View className='coupon-title'>活动奖励</View>
                        {isEmpty(couponData) && <View className='coupon' onClick={this.navigateToPlugin}>创建奖池</View>}
                        {!isEmpty(couponData) && <View className='coupon' onClick={this.navigateToPlugin}>查看奖池</View>}
                        {
                            !isEmpty(couponData) && <View className='prize-num'>已选奖池编号：{couponData}</View>
                        }
                    </View>
                    <View className='warn-bar'>
                        <View className='warn-icno iconfont'>&#xe607;</View>
                        <View className='warn-txt'>优惠券为游戏胜利时发放，设置总中奖率不得低于99.99%</View>
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
                <View className='model-bg'>
                    <Image className='img-bg' src='http://q.aiyongbao.com/interact/bg.png' />
                    <View className='second-title'>{args.subTitle}</View>
                </View>
                <View className='create-bottom'>
                    {
                        title == '创建丘比特之箭活动' && <View className='sure-btu' onClick={this.createActivity.bind(this, 'sure')}>确认创建活动</View>
                    }
                    {
                        title == '修改丘比特之箭活动' && <View className='edit-box'>
                            <View className='sure-btu' onClick={this.createActivity.bind(this, 'edit')}>确认修改活动</View>
                            <View className='give-up' onClick={this.giveUpEdit}>放弃修改</View>
                        </View>
                    }

                </View>

            </View>
        );
    }
}

//将store里面的值映射为props
const mapStateToProps = ({ hotReducer }) => {
    return {
        activityData: hotReducer.activityData,
        title: hotReducer.title,
        operType: hotReducer.operType,
        activityID: hotReducer.activityID
    }
}
const mapDispatchToProps = {
    changeTitleAction,
    setActivityUrlAction
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePage);
