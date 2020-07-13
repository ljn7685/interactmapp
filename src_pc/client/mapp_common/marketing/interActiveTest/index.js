import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';
import { tradeBeacon } from "mapp_common/utils/beacon";
import { storage } from "mapp_common/utils/storage";
//几种互动活动类型
const INTERACTIVE = [
    {
        title: '互动小游戏',
        content: '通过小游戏引导用户，全面提升店铺粉丝数/加购量，针对店铺自定义设置，多种玩法随意组合，大促必备',
        pic: '//q.aiyongbao.com/miniapp/interactive/hdxyx.png'
    },
    {
        title: '关注有礼',
        content: '关注店铺赠送优惠券/红包/实物宝贝引导用户关注店铺，促进转化，方便后期深度运营',
        pic: '//q.aiyongbao.com/miniapp/interactive/gzyl.png'
    },
    {
        title: '分享领券',
        content: '无线引流新方式，一键设置活动内容简单方便，增加店铺曝光，挖掘精准新客户，优惠券提升店铺转化率',
        pic: '//q.aiyongbao.com/miniapp/interactive/fxlq.png'
    },
    {
        title: '收藏/加购有礼',
        content: '收藏/加购赠礼，提升宝贝转化的同时提升商品搜索排',
        pic: '//q.aiyongbao.com/miniapp/interactive/scjgyl.png'
    }
]
class InterActiveTest extends Component {
    config = {
        navigationBarTitleText: '手淘营销',
    }
    constructor (props) {
        super(props);
        this.state = { 
            hasChoose: [0, 0, 0, 0] //存储已经预约的按钮
        };
    }
    componentDidMount() {
        let hasChoose = storage.getItemSync('hasOrder');
        if(hasChoose){
            this.setState({
                hasChoose : hasChoose.split(',')
            })
        }
    }
    render () {
        let { hasChoose } = this.state;
        return (
                <View>
                    <View className = 'inter-active-top'>手淘营销模块即将上线，预约成功后会在第一时间收到上线通知。</View>
                    {
                        INTERACTIVE.map((item,index) => {
                            return (
                                <View className = 'active-card'>
                                    <View className = 'active-card-title'>{item.title}</View>
                                    <View className = 'active-card-bottom'>
                                        <Image src = {item.pic} className = 'active-card-png'/>
                                        <Text className = 'active-card-text'>{item.content}</Text>
                                        <View className = { hasChoose[index] == 1? 'active-card-but-has' : 'active-card-but'} onClick = {()=>{
                                            hasChoose[index] = 1;
                                            let hasOrder = hasChoose.join(',');
                                            storage.setItem('hasOrder', hasOrder);
                                            tradeBeacon({ func:`interact${index}` });
                                            this.setState({
                                                hasChoose
                                            })
                                        }}>{hasChoose[index] == 1 ? '已预约' : '立即预约'}</View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
        );
    }
}


export default InterActiveTest;
