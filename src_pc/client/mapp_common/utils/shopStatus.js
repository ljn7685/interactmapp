import { getUserInfo } from "tradePolyfills/index";
import Taro from "@tarojs/taro";

export const moreShop_getState = () => {
    return Taro.getApp().store.getState().moreShopReducer || {};
};

/*
 * @Description: 判断是否是多店切换到其他店铺状态
 * @Author: Z-can
 * @Date: 2020-06-23 20:58:29
 */ 
export const currentShopStatus = () => {
    let { currentShopName } = moreShop_getState();
    let defaultStatus = {
        isOtherShop: false
    };
    if (getUserInfo().userNick && currentShopName) {
        if (currentShopName === getUserInfo().userNick) {
            defaultStatus.isOtherShop = false;
        } else {
            defaultStatus.isOtherShop = true;
            defaultStatus.currentShopName = currentShopName;
        }
    }
    // console.log('defaulstStatus',defaultStatus)
    return defaultStatus;
}