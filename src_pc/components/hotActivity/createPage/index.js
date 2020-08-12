import React, { Component } from 'react';
import Taro from "@tarojs/taro";
import { Text, View, Input, Image, Radio, RadioGroup, Label, CheckboxGroup, Checkbox } from '@tarojs/components';
import './index.scss';
import * as action from '../actions';
import { isEmpty } from '../../utils/index';
import { connect } from 'react-redux';
import SelectGoods from "../selectGoods";
import { getSaleGoodsApi } from '../../../../public/bPromiseApi';

const collectLimit = 4;
const pageSize = 2;
class CreatePage extends Component {
    constructor (props) {
        super(props);
        this.state = { showSelectGoods:false };
    }
    componentDidMount () {
        
        var plugin = requirePlugin("myPlugin");
        // 这个bridge用于和插件进行数据通信 
        let self = this;
        const bridge = {
            // bizCode: "3000000012505562",//c
            bizCode: "3000000025552964", // b
            // 此处输入想配置的业务身份（消费者端appid）  
            // 这个方法用于获取插件中用户选择的奖池ID  
            getCheckBenefitID ({ ename, poolID }) {
                console.log(ename, poolID);
                // self.props.inputChangeAction('activeRewards', { 'ename': ename, 'poolID': poolID })
                self.props.getBenefitQueryAction(ename, poolID);
                self.props.inputChangeAction('couponData', poolID);
            },
        };
        // 获取优惠券信息的重要一步
        plugin.setBridge(bridge);
    }
    /**
     * 获取输入框的值
     * @param {*} type 
     * @param {*} e 
     */
    inputChange = (type, e) => {
        this.props.inputChangeAction(type, e.target.value);
    }
    radioChange = (type, e) => {
        this.props.inputChangeAction(type, e.detail.value);
        if (type === "collectType" && e.detail.value === 'random') {
            this.onRandomSelect();
        }
    }
    checkboxChange = (type,  e) => {
        this.props.inputChangeAction(type, e.detail.value);
    }
    onSelectChange = (type, value) => {
        this.props.inputChangeAction(type, value);
    }
    onRandomSelect = async () => {
        try{
            const goods = await getSaleGoodsApi({
                fields: "num_iid,title,price,pic_url",
                page_no: 1,
                page_size: collectLimit,
            });
            if (goods.items) {
                this.props.inputChangeAction('goods', goods.items);
            }
        } catch (err) {
            Taro.showToast({ title:'随机推荐失败' });
        }
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
    createActivity = (type) => {
        const { creacteActivityAction } = this.props;
        let operationType = 2;
        if (type === 'sure') {
            // operationType  1-添加新的活动   2-修改活动
            operationType = 1;
        }
        creacteActivityAction(operationType);
    }
    /**
     * 放弃修改，回到活动管理
     *  
     */
    giveUpEdit = () => {
        this.props.changeTitleAction('活动管理', 'management#allActivity');
    }
    render () {
        const { title, activityData } = this.props;
        const { showSelectGoods } = this.state;
        const isCheckShare = activityData.gameTask && activityData.gameTask.includes('share');
        const isCheckCollect = activityData.gameTask && activityData.gameTask.includes('collect');
        console.log('activityData', activityData);
        return (
            <View className='create-page'>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <Text className='name-text'>活动名称</Text>
                    <Input className='name-input' type='text' maxlength='16' value={activityData.activeName} onInput={(e) => { this.inputChange('activeName', e); }} />
                    <Text className='name-num'>{activityData.activeName.length}/16</Text>
                    <Text className='name-memo'>备忘用，不展示给买家</Text>
                </View>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <View className='name-text'>&emsp;副标题</View>
                    <Input className='name-input' type='text' maxlength='16' value={activityData.subTitle} onInput={(e) => { this.inputChange('subTitle', e); }} />
                    <Text className='name-num'>{activityData.subTitle.length}/16</Text>
                </View>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <View className='time-txt'>活动时间</View>
                    <Input className='time-input' value={activityData.startDate} onInput={(e) => { this.inputChange('startDate', e); }} />
                    <Text className='time-to'>至</Text>
                    <Input className='time-input' value={activityData.endDate} onInput={(e) => { this.inputChange('endDate', e); }} />
                </View>
                <View className='name-box'>
                    <Text className='warn-xing'>*</Text>
                    <View className='time-txt'>游戏难度</View>
                    <RadioGroup onChange={e => {this.radioChange('gameLevel', e);}}>
                        <Label   key={0}>
                            <Radio  value='0' checked={activityData.gameLevel === '0'}>简单</Radio>
                        </Label>
                        <Label   key={1}>
                            <Radio  value='1' checked={activityData.gameLevel === '1'}>普通</Radio>
                        </Label>
                        <Label   key={2}>
                            <Radio  value='2' checked={activityData.gameLevel === '2'} >困难</Radio>
                        </Label>
                    </RadioGroup>
                </View>
                <View className='task-box'>
                    <Text className='warn-xing'>*</Text>
                    <View className='task-txt'>复活任务</View>
                    <View className='task-content'>
                        <CheckboxGroup onChange={e => {this.checkboxChange('gameTask', e);}}>
                            <Label  key='share' className='task-check'>
                                <Checkbox  value='share' checked={isCheckShare}>分享</Checkbox>
                            </Label>
                            <Label  key='collect' className='task-check'>
                                <Checkbox  value='collect' checked={isCheckCollect}>收藏</Checkbox>
                            </Label>
                        </CheckboxGroup>
                        {isCheckShare && <View className='share-box'>
                            <Text className='share-left'>分享活动：每分享给1个好友，可获得1次游戏机会，最多邀请</Text>
                            <Input type='number' className='num-input'  maxlength='2' value={activityData.maxShareNum} onInput={(e) => { this.inputChange('maxShareNum', e); }} />
                            <Text>好友</Text>
                        </View>}
                        {isCheckCollect && <View className='collect-box'>
                            <View className='collect-input'>
                                <Text>收藏商品：可获得1次游戏机会，最多收藏</Text>
                                <Input type='number' className='num-input' maxlength='2' value={activityData.maxCollectNum} onInput={(e) => { this.inputChange('maxCollectNum', e); }} /><Text>个商品</Text>
                            </View>
                            <View className='collect-select'>
                                <RadioGroup onChange={e => {this.radioChange('collectType', e);}}>
                                    <Label   key={0}>
                                        <Radio className='collect-radio' value='random' checked={activityData.collectType === 'random'}>随机推荐</Radio>
                                    </Label>
                                    <Label   key={1}>
                                        <Radio className='collect-radio' value='appoint' checked={activityData.collectType === 'appoint'}>指定商品</Radio>
                                    </Label>
                                </RadioGroup>
                                {activityData.collectType === 'appoint' && <View className='select-btn' onClick={() => {this.setState({ showSelectGoods:true });}}>选择</View>}
                                {activityData.collectType === 'appoint' && <Text className='select-info'>已选<Text className='select-num'>{activityData.goods ? activityData.goods.length : 0}/{collectLimit}</Text>件商品</Text> }
                            </View>
                        </View>}
                    </View>
                    
                </View>
                <View className='name-box'>
                    <Text className='res-text'>&emsp;复活次数</Text>
                    <Input type='number' className='res-input' value={activityData.gameNumber} onInput={(e) => { this.inputChange('gameNumber', e); }} />
                    <Text className='unit'>次</Text>
                    <Text className='res-memo'>买家关注店铺后，游戏失败可重新挑战次数</Text>
                </View>
                <View className='coupon-box'>
                    <View className='coupon-top'>
                        <Text className='warn-xing'>*</Text>
                        <View className='coupon-title'>活动奖励</View>
                        {isEmpty(activityData.couponData) && <View className='coupon' onClick={this.navigateToPlugin}>创建奖池</View>}
                        {!isEmpty(activityData.couponData) && <View className='coupon' onClick={this.navigateToPlugin}>查看奖池</View>}
                        {
                            !isEmpty(activityData.couponData) && <View className='prize-num'>已选奖池编号：{activityData.couponData}</View>
                        }
                    </View>
                </View>
                <View className='rules-box'>
                    <View className='rules-des'>规则说明</View>
                    <View className='rules-content'>
                        <Text>活动时间：{activityData.startDate} - {activityData.endDate}</Text>
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
                    <View className='second-title'>{activityData.subTitle}</View>
                </View>
                <View className='create-bottom'>
                    {
                        title === '创建丘比特之箭活动' && <View className='sure-btu' onClick={this.createActivity.bind(this, 'sure')}>确认创建活动</View>
                    }
                    {
                        title === '修改丘比特之箭活动' && <View className='edit-box'>
                            <View className='sure-btu' onClick={this.createActivity.bind(this, 'edit')}>确认修改活动</View>
                            <View className='give-up' onClick={this.giveUpEdit}>放弃修改</View>
                        </View>
                    }

                </View>
                {showSelectGoods && 
                <SelectGoods 
                    onClose={() => {this.setState({ showSelectGoods:false });}} 
                    onSetGoods={value => this.onSelectChange('goods', value)}
                    goods={activityData.goods}
                    goodsLimit={collectLimit}
                    pageSize={pageSize}
                >
                </SelectGoods>}
            </View>
        );
    }
}

// 将store里面的值映射为props
const mapStateToProps = ({ hotReducer }) => {
    return {
        activityData: hotReducer.activityData,
        title: hotReducer.title,
        operType: hotReducer.operType,
        activityID: hotReducer.activityID,
        initActivityData: hotReducer.initActivityData,
    };
};
const mapDispatchToProps = action;

export default connect(mapStateToProps, mapDispatchToProps)(CreatePage);
