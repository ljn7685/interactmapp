import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import { isEmpty } from "mapp_common/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { storage } from "mapp_common/utils/storage";
import './index.scss';
import { giveFreeDayBeacon, getFreeDays } from './newUserModelFun.js';
import { ENV } from "@/constants/env";
import moment from "mapp_common/utils/moment";
import shopLevel from "tradePublic/autoRate/shopLevel";
import getSellerInfo from "tradePublic/autoRate/api";
const date = moment().format('YYYY-MM-DD');

const { app } = ENV;

class ShopInfoLevel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            levelObj: ''//店铺信息初始化
        }
    }
    componentDidMount() {
        //获取店铺信息
        this.getShopInfo();
    }
    /**
     * 获取用户的店铺等级信息
     */
    getShopInfo = () => {
        getSellerInfo(
            //成功返回
            (data) => {
                this.setState({
                    levelObj: shopLevel(data.user.seller_credit),
                })
            },
            //失败返回
            (err) => {
                Taro.showToast({
                    title: JSON.stringify(err),
                    duration: 2000,
                });
            }
        )
    }

    render() {
        let { levelObj } = this.state;
        let jxs = null;
        if (isEmpty(levelObj)) {
            jxs = <View className='empty-shop-info'>店铺等级加载中，请稍后…</View>
        } else {
            jxs = <View className='rate-management-box'>
                <View className='rate-management-top-txt'>
                    <View className='rate-management-left'>买卖双方至少一方好评才能增加店铺信誉，</View>
                    <View className='rate-management-right'>建议开启！</View>
                </View>
                <View className='rate-management-level-start'>
                    <View className='rate-management-level-start-top'>
                        <View className='level-img-box-now'>
                            <Image src={levelObj.level_pic_path1.uri} style={{ width: levelObj.level_pic_path_width1, height: '36rpx' }} />
                            <View className='level-txt-now'>当前等级</View>
                        </View>
                        <View className='rate-management-level-start-middle'>
                            <View style={{ width: levelObj.exp }} className='rate-management-level-start-middle-line'></View>
                            <View className='rate-management-level-start-bottom'>
                                <Text className='rate-management-level-start-bottom-text'>还差{levelObj.need}个评价</Text>
                            </View>
                        </View>
                        <View className='level-img-box-next'>
                            <Image src={levelObj.level_pic_path2.uri} style={{ width: levelObj.level_pic_path_width2, height: '36rpx' }} />
                            <View className='level-txt-next'>即将等级</View>
                        </View>
                    </View>
                </View>
            </View>
        }
        return jxs;
    }
}

export default ShopInfoLevel;
