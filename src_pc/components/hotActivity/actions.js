import { getActivityInfoIdApi, createActivityApi, benefitQueryApi } from '../../public/bPromiseApi/index';
import Taro from '@tarojs/taro';
import moment from 'moment';
import { isEmpty, matchNum, matchTime } from '../utils/index';

export const TITLE = "TITLE"; // 顶部的标题
export const SET_DATA = "SET_DATA"; // 通过id保存游戏配置数据
export const SET_URL = "SET_URL";// 保存创建成功后的活动url
export const SET_VALUE = "SET_VALUE"; // input框的输入值变化

/**
 * 改变顶部标题
 * @param {*} values 
 */
export const changeTitleAction = (title, titleType, activityID, operType) => {
    return {
        type: TITLE,
        title: title,
        titleType: titleType,
        activityID: activityID,
        operType: operType,
    };
};
/**
 * 活动的数据，单独存储吧
 * @param {*} activityData 
 */
export const changeActivityDataAction = (activityData) => {
    return {
        type: TITLE,
        activityData: activityData,
    };
};
/**
 * 保存输入框的值
 * @param {*} typeItem 
 * @param {*} value 
 */
export const inputChangeAction = (typeItem, value) => {
    return {
        type: SET_VALUE,
        typeItem: typeItem,
        value: value,
    };
};
/**
 * 保存活动创建成功的url
 * @param {*} data 
 */
export const setActivityUrlAction = (activityUrl) => {
    return {
        type: TITLE,
        activityUrl: activityUrl,
    };
};
export const getBenefitQueryAction = (ename, poolID) => {
    return async (dispatch) => {
        let data = await benefitQueryApi({ 'ename': ename, 'app_name': 'promotioncenter-3000000025552964', 'award_type':1 });
        if(data.result.code === 'SUCCESS') {
            dispatch({
                type: SET_VALUE,
                typeItem: 'activeRewards',
                value: { 'ename': ename, 'poolID': poolID, 'datas': data.result.datas },
            });
        }else{
            Taro.showToast({
                title: '优惠券创建失败',
                duration: 2000,
            });
        }
    };
};
/**
 * 修改游戏的时候，，通过游戏id拿到
 * @param {*} id 
 */
export const getActivityByIdAction = (id, operType) => {
    // 通过id拿到游戏数据
    return async (dispatch) => {
        let data = await getActivityInfoIdApi({ 'activeID': id });
        let newData = Object.assign({}, data.data[0]);
        newData.activeUrl = decodeURIComponent(data.data[0].active_url);
        newData.activeName = data.data[0].active_name;
        newData.subTitle = data.data[0].sub_title;
        newData.gameNumber = data.data[0].game_number;
        if (operType === '创建') {
            newData.startDate = moment().format("YYYY-MM-DD");
            newData.endDate = moment().add(7, 'days').format("YYYY-MM-DD");
            newData.activeRewards = '';
            newData.couponData = '';
        } else if (operType === '修改') {
            newData.startDate = data.data[0].start_date.substring(0, 10);
            newData.endDate = data.data[0].end_date.substring(0, 10);
            newData.activeRewards = JSON.parse(data.data[0].active_rewards);
            newData.couponData = JSON.parse(data.data[0].active_rewards).poolID;
        }
        if (data.code === 200) {
            dispatch({
                type: TITLE,
                title: operType + '丘比特之箭活动',
                titleType: 'hotActivity#create',
                activityID: id,
                operType: operType,
                activityData: newData,
            });
        } else {
            Taro.showToast({
                title: '参数不对，失败了',
                duration: 2000,
            });
        }
    };
};
/**
 * 创建活动，修改活动
 * @param {*} operationType 
 */
export const creacteActivityAction = (operationType) => {
    return async (dispatch, getState) => {
        let newArgs = getState().hotReducer.activityData;
        // 判断必填项
        if (isEmpty(newArgs.activeName) || isEmpty(newArgs.subTitle) || isEmpty(newArgs.startDate) || isEmpty(newArgs.endDate) || isEmpty(newArgs.couponData)) {
            Taro.showToast({
                title: '必填项不能为空',
                duration: 2000,
            });
            return;
        }
        newArgs.activeRewards = JSON.stringify(newArgs.activeRewards);// 优惠卷
        newArgs.operationType = operationType;// 操作类型
        newArgs.activeUrl = encodeURIComponent(newArgs.activeUrl);// 活动地址
        newArgs.activeID = getState().hotReducer.activityID;
        if (matchTime([newArgs.startDate, newArgs.endDate]) && matchNum(newArgs.gameNumber)) {
            let data = await createActivityApi({ ...newArgs });
            if (data.code === 200) {
                if (operationType === 2) {
                    // 修改成功后，就回活动管理了
                    dispatch({
                        type: TITLE,
                        title: '活动管理',
                        titleType: 'management#allActivity',
                    });
                } else {
                    let newActiveUrl = decodeURIComponent(newArgs.activeUrl) + data.activityId;
                    dispatch({
                        type: TITLE,
                        title: '活动创建成功',
                        titleType: 'hotActivity#success',
                        activityUrl: newActiveUrl,
                    });
                }
            } else {
                Taro.showToast({
                    title: '参数不对，失败了',
                    duration: 2000,
                });
            }
        }
    };
};
