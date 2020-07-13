import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import { isEmpty, refreshPlugin } from "mapp_common/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { storage } from "mapp_common/utils/storage";
import './index.scss';
import { giveFreeDayBeacon, modelContent, getFreeDays } from './newUserModelFun.js';
import { ENV } from "@/constants/env";
import moment from "mapp_common/utils/moment";
import { api } from "mapp_common/utils/api";
import { fetchUserInfoFromTcUser } from "mapp_common/utils/userInfo";
import { marketingBeacon } from "mapp_common/utils/beacon";
const date = moment().format('YYYY-MM-DD');

const { app } = ENV;

class NewUserModel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpened: false,
            isPayAfter: false, //是否完成支付
            content: {}
        };
    }
    componentDidMount() {
        //判断本地是不是有缓存，是不是上次点过取消的用户
        let isRefuse = storage.getItemSync(getUserInfo().userId + 'free');
        let { tag, promotion, createDate } = getUserInfo();
        //活动参与的条件：交易的，有tag的，没有参与的记录，本地缓存没有点击关闭的记录，创建日期是当天的，才能展现
        if (app == 'trade' && !isEmpty(tag) && tag.indexOf('newUserRenewTest') > -1 && isEmpty(promotion) && isEmpty(isRefuse) && createDate.split(' ')[0] === date) {
            this.setState({
                isOpened: true,
                content: modelContent()
            })
            //订单量的埋点
            this.giveOrderBeacon();
            //展现埋点
            let remainNewUser = isEmpty(getUserInfo().remainNewUser) ? 'oneRmb_15' : getUserInfo().remainNewUser;
            giveFreeDayBeacon('show', remainNewUser);
        }
    }
    /**
     * 订单数量的埋点
     * @param {} values 
     */
    giveOrderBeacon = () => {
        const total = getUserInfo().order_total;
        let type = 'up120';
        if(total > 30 && total <= 120){
            type = '30-120';
        }else if(total > 10 && total <= 30){
            type = '10-30';
        }else if(total >= 5 && total <= 10){
            type = '5-10';
        }else if(total >= 2 && total <= 4){
            type = '2-4';
        }
        marketingBeacon('order',0,type);
    }
    /**
     * 用户获取赠送天数
     * args-对象参数，promotionCode，赠送的方式；actCycle，赠送天数
     */
    getFreeDaysFun = async (values) => {
        let data = await getFreeDays(values);
        if (!isEmpty(data) && data.code == 200) {
            Taro.showToast({
                title: data.result,
                icon: 'success',
                duration: 2000
            })
            //更新用户信息
            fetchUserInfoFromTcUser({
                callback: newUserInfo => {
                    //刷新刷新
                    refreshPlugin();
                }
            })
        } else if (!isEmpty(data)) {
            Taro.showToast({
                title: data.msg,
                icon: 'success',
                duration: 2000
            })
        }
    }
    /*
     * @Description 点击按钮
     *@values fasle，点击取消，true，点击确定
    */
    clickBtu = (values) => {
        this.setState({
            isOpened: false
        })
        //点击就本地存储一下
        storage.setItemSync(getUserInfo().userId + 'free', 'refuse');
        let remainNewUser = isEmpty(getUserInfo().remainNewUser) ? 'oneRmb_15' : getUserInfo().remainNewUser;
        if (values) {
            //点击确定的时候，埋点记录
            giveFreeDayBeacon('sure', remainNewUser);
            if (remainNewUser.split('_')[0] == 'oneRmb') {
                //将用户名转一下，ios不能传中文字符串
                let nick = encodeURI(getUserInfo().userNick);
                //将付款后的框弹出来
                this.setState({
                    isPayAfter: true
                })
                //跳转支付
                my.qn.navigateToWebPage({
                    url: `http://q.aiyongbao.com/trade/pay/payindex.html?nickName=${nick}`
                });
                return;
            }
            //点击参与的时候,赠送免费的天数
            this.getFreeDaysFun(remainNewUser);
        } else {
            //在埋个取消的点
            giveFreeDayBeacon('cancel', remainNewUser);
        }
    }
    /**
     * 付款完成后
     */
    clickPayAfter = (value) => {
        this.setState({
            isPayAfter: false
        })
        let remainNewUser = isEmpty(getUserInfo().remainNewUser) ? 'oneRmb_15' : getUserInfo().remainNewUser;
        //不管点击付款成功还是未付款，都去查一下数据库是否付款
        this.getFreeDaysFun(remainNewUser);
    }

    /**
     * 完成付费的弹窗，判断是否完成了付费
     */
    modelPayAfter() {
        let { isPayAfter } = this.state;
        return isPayAfter &&
            <AtModal
                isOpened={true}
                closeOnClickOverlay={false}
                className='model-free-box'
            >
                <AtModalHeader>
                    <View className='header-title'>温馨提示</View>
                </AtModalHeader>
                <AtModalContent>
                    <View className='model-content'>完成付款后，请根据您的支付情况点击下面的按钮。</View>
                </AtModalContent>
                <AtModalAction>
                    <Button className='leftBtn' onClick={this.clickPayAfter.bind(this, false)}>未付款</Button>
                    <Button className='rightBtn' onClick={this.clickPayAfter.bind(this, true)}>已完成付款</Button>
                </AtModalAction>
            </AtModal>;
    }

    render() {
        let { isOpened, isPayAfter, content } = this.state;
        return (
            <View>
                {
                    isOpened && <AtModal
                        isOpened={true}
                        closeOnClickOverlay={false}
                        className='result-wrapper'
                    >
                        <AtModalHeader>
                            <View className='header-title'>{content.header}</View>
                            <View className='closer' onClick={this.clickBtu.bind(this, false)}>X</View>
                        </AtModalHeader>
                        <AtModalContent>
                            <View className='text-row'>{content.subject}</View>
                        </AtModalContent>
                        <AtModalAction>
                            <Button className='leftBtn' onClick={this.clickBtu.bind(this, false)}>{content.leftBtu}</Button>
                            <Button className='rightBtn' onClick={this.clickBtu.bind(this, true)}>{content.rightBtu}</Button>
                        </AtModalAction>
                    </AtModal>
                }
                {/* 完成支付以后 */}
                {
                    isPayAfter && this.modelPayAfter()
                }
            </View>
        );
    }
}

export default NewUserModel;
