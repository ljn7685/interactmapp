import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { navigateTo, isEmpty } from "mapp_common/utils";
import { showBeacon, getPeerPid } from '../config';
import './index.scss';
import { ENV } from "@/constants/env";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { storage } from "mapp_common/utils/storage";
import { getAd } from "tradePublic/marketing";
import moment from "mapp_common/utils/moment";
const date = moment().format('YYYY-MM-DD');


class EnterPeer extends Component {
    constructor(props) {
        super(props);
        this.startClientY = 0; //手指落下的位置
        this.touchClientY = 0;//手指移动的位置
        this.clientY = ENV.app == 'item' ? 250 : 280;//交易和商品初始位置不一样
        this.state = {
            isShow: false,//初始值为fasle，默认不展现
        }
    }
    componentDidMount() {
        //time为-1是传的初始值，如果不是初始值，就证明拿到了用户信息，就不会在被更新用户信息
        if (this.props.vipRemain != -1) {
            this.getAdInfo()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.vipRemain != nextProps.vipRemain) {
            this.getAdInfo()
        }
    }
    /**
     * 获取广告信息，是否展示
     */
    getAdInfo = () => {
        const vipFlag = getUserInfo().vipFlag;
        //获取本地存储的用户是否点击信息
        let isPeer = storage.getItemSync('Peer' + getUserInfo().userId + ENV.app);
        let pid = getPeerPid();
        getAd({
            pid,
            callback: res => {
                if (res.status == 200) {
                    if ((isEmpty(isPeer) || isPeer != date) && vipFlag == 0) {
                        this.setState({
                            isShow: true
                        })
                         //618入口埋点
                        showBeacon('enter');
                    }
                    if (vipFlag != 0 && isEmpty(isPeer)) {
                        this.setState({
                            isShow: true
                        })
                        //618入口埋点
                        showBeacon('enter');
                    }
                }
                if (res.status == 500 && !isEmpty(isPeer)) {
                    storage.removeItem('Peer' + getUserInfo().userId + ENV.app, '');
                }
            }
        })
    }
    /**
     * 手指放上
     */
    handleTouchstart = (e) => {
        this.startClientY = e.changedTouches[0].clientY;
    }
    /**
     * 移动的时候
     */
    handleTouchMove = (e) => {
        this.touchClientY = e.changedTouches[0].clientY;//移动时的距离
        this.clientY = this.clientY + parseInt(this.touchClientY - this.startClientY);//位置的改变
        this.startClientY = this.touchClientY;
    }
    /**
     * 移动结束后,所有的位置清0
     */
    handleTouchEnd = (e) => {
        this.startClientY = 0;
        this.touchClientY = 0;
    }
    /**
     * 点击图片。进入页面
     */
    goPeerPage = () => {
        showBeacon('show');
        navigateTo({ url: '/public/mapp_common/marketing/peerData/index' });
    }
    /**
     * 关闭入口，存入本地
     */
    closePeer = () => {
        this.setState({
            isShow: false
        })
        storage.setItemSync('Peer' + getUserInfo().userId + ENV.app, date)
    }

    render() {
        return (
            <View className='enter-peer'>
                <movable-area className='movable-area'>
                    <movable-view direction="vertical" y={this.clientY} onTouchStart={this.handleTouchstart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd} style={{ display: this.state.isShow ? '' : 'none' }}>
                        <Image src='//q.aiyongbao.com/2020618/imgpc/close.png' className='close-peer' onClick={this.closePeer}></Image>
                        <Image src='//q.aiyongbao.com/2020618/img/mb-enter.png' className='enter-img' onClick={this.goPeerPage}></Image>
                    </movable-view>
                </movable-area>
            </View>
        );
    }
}
export default EnterPeer;