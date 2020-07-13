import Taro, { Component } from '@tarojs/taro';
import { isEmpty, refreshPlugin } from "mapp_common/utils";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { api } from "mapp_common/utils/api";
import { marketingBeacon } from "mapp_common/utils/beacon";
import moment from "mapp_common/utils/moment";
const date = moment().format('YYYY-MM-DD');
/**
* 封装一层埋点
*/
export const giveFreeDayBeacon = (type, remainNewUser) => {
    let level = remainNewUser.split('_')[0];//
    let days = remainNewUser.split('_')[1];//赠送天数
    marketingBeacon(level + days, 0, type);
}
/**
 * 广告拦截逻辑
 */
export const holdUpAd = () => {
    //先尝后买用户，就把所有的广告给屏蔽掉
    const { tag, createDate, vipFlag } = getUserInfo();
    if (!isEmpty(tag) && tag.indexOf('newUserRenewTest') > -1 && (vipFlag > 0 || createDate.substr(0, 10) === date)) {
        return false;
    }
    return true;
}
/**
 * 弹窗显示的内容
 */
export const modelContent =()=>{
   let remainNewUser = isEmpty(getUserInfo().remainNewUser) ? 'oneRmb_15' : getUserInfo().remainNewUser;
    let conent = {
        subject: `爱用科技送您${remainNewUser.split('_')[1]}天【高级版】助您打单发货，在此期间所有高级功能均可使用，请知晓。`,
        header: '高级功能服务赠送提醒',
        leftBtu: '不了，谢谢',
        rightBtu: '确定'
    }
    if(remainNewUser.split('_')[0] == 'oneRmb'){
        conent = {
            subject: `爱用科技邀您参与${remainNewUser.split('_')[1]}天【高级版】1元购公测活动，助您打单发货，在此期间所有高级功能均可使用，仅需1元！`,
            header: '1元试用高级服务',
            leftBtu: '不需要',
            rightBtu: '立即参与'
        }
    }
    return conent;
}
/**
 * 调取接口,添加用户赠送记录
 * @promotionCode 赠送的类型
 * @actCycle 赠送的天数
 */
export const getFreeDays =(values)=>{
    let args = {
        promotionCode: values,
        actCycle: values.split('_')[1]
    }
    return new Promise((resolve, reject)=>{
        api({
            apiName: 'aiyong.user.vip.add',
            args: args,
            callback: res=>{
                resolve(res)
            },
            errCallback: err=>{
                reject(err)
            }
        })
    })
}



