import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';
import Loading from './loading/index';
import ShowContent from './showContent/index';
import { api } from "mapp_common/utils/api";
import { mapList, showBeacon, goToBuy , imgUrl} from './config.js';
import { ENV } from "@/constants/env";

//传递给loading的分数，0初始值
const numList = [0,1,3,16,32,100];
/**
 * 入口图片
 */
class PeerData extends Component {
    config = {
        navigationBarTitleText: '同行数据',
    }
    constructor(props) {
        super(props);
        this.state = {
            showDynamic: true,//是否显示动画
            itemDataList:''
        };
        this.app = ENV.app;      
}
    componentDidMount() {
        if(this.app == 'item'){
            //是商品就调取接口
            this.getUserOperationDate();
        }
    }
    /**
     * 点击跳转购买
     */
    buyPage = ()=>{
        showBeacon('click');//点击埋点
        goToBuy();//跳转购买页面
    }
    /**
     * api,获取用户操作具体信息 
     */
    getUserOperationDate = () => {
            api({
                apiName: 'aiyong.item.user.operation.data.get',
                callback: (res) => {
                    this.setState({
                        itemDataList:res,
                        showDynamic:false
                    })
                },
                errCallback:(err)=>{
                    this.setState({
                        itemDataList:[],
                        showDynamic:false
                    })
                }
            })
    }
    /**
     *  商品宝贝装修
     * @param {*} title 标题
     * @param {*} score 0-2，是下标呀
     */
    itemApp(title,score) {
        const {showDynamic, itemDataList} = this.state; 
        let num = 1;//初始值为0
        if(itemDataList.length > 0){
            //计算使用了多少个功能
            let res = itemDataList[score];
            Object.keys(res).forEach((key)=>{
                if(res[key] == true){
                    num += 1
                }
            })
        }else{
            num = 0;//第一次渲染的时候，分数为0
            //没有获取到数据的时候，就算作为全部未使用
            if(showDynamic == false){
                num = 1
            }
        }
        //有3个数组数据，下标为2的数组数据只有3条数据，num的初始值为1，所有score为2，num为4，就是100%使用
        if(score == 2 && num == 4){
            num = 5
        }
        return <View className='top'>
            <View className='load'>
                <Loading score={numList[num]} showDynamic={showDynamic} />
            </View>
            {
                numList[num] == 100 && <View className='full-data'>持续使用大促力挽狂澜</View>
            }
            {
                numList[num] !=100 && <View className='data-box'><Image src={`${imgUrl}arrow.png`} className='arrow'></Image>
                                <View className='data'>落后{100 - numList[num]}%的同行</View></View>
            }
      
            <View className='baby_title'>{title}</View>
        </View>
    }
    //交易第一部分
    tradeIncome(title, content) {
        return <View className='income-top'>
            <View className='income-title'>{title}</View>
            <View className='income-txt'>
                <Image className='bg-txt' src={`${imgUrl}trade_bg_one.png`}></Image>
                <View className='income-content'>{content}</View>
            </View>
        </View>
    }
    render() {
        const {itemDataList} = this.state;
        return (
            <View className='contenter'>
                <Image className='backgroud' src={`${imgUrl}bg.png`}></Image>
                <View className='content-box'>
                    <View className='content-top'>
                        {this.app == 'item' && this.itemApp('宝贝装修',0)}
                        {this.app == 'trade' && this.tradeIncome('提收入 降成本', '95%的皇冠卖家都在用')}
                        <View className='content'>
                            {
                                mapList[0].map((item,index) => {
                                    return (
                                        <ShowContent
                                            src={(itemDataList.length > 0 && itemDataList[0][item.type]) || false ? item.srced : item.src }
                                            used={(itemDataList.length > 0 && itemDataList[0][item.type]) || false ? true : false}
                                            title={item.title}
                                            content={item.content}
                                        />
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View className='line'></View>
                    <View className='content-top'>
                        {this.app == 'item' && this.itemApp('引流优化',1)}
                        {this.app == 'trade' && this.tradeIncome('提升DSR', '最快一周 安全提升店铺权重')}
                        <View className='content'>
                            {
                                mapList[1].map((item,index) => {
                                    return (
                                        <ShowContent
                                        src={(itemDataList.length > 0 && itemDataList[1][item.type]) || false  ? item.srced : item.src }
                                        used={(itemDataList.length > 0 && itemDataList[1][item.type]) || false  ? true : false}
                                        title={item.title}
                                        content={item.content}
                                        />
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View className='line'></View>
                    <View className='content-top'>
                        {this.app == 'item' && this.itemApp('促销推广',2)}
                        {this.app == 'trade' && this.tradeIncome('提升效率', '多端支持 随时管店 高效便捷')}
                        <View className='content'>
                            {
                                mapList[2].map((item,index) => {
                                    return (
                                        <ShowContent
                                        src={(itemDataList.length > 0 && itemDataList[2][item.type]) || false  ? item.srced : item.src }
                                        used={(itemDataList.length > 0 && itemDataList[2][item.type])|| false  ? true : false}
                                        title={item.title}
                                        content={item.content}
                                        />
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                <View className='buttom' onClick={this.buyPage}>
                    <View>每天仅需</View>
                    <View className='btu-num'>3毛5</View>
                    <Text decode="{{true}}">&nbsp; 与行业大神一起冲刺618</Text>
                    <Image src={`${imgUrl}more.png`} className='arrow-right'></Image>
                </View>
            </View>
        )
    }
}

export default PeerData;