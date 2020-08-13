import { getActivityInfoIdApi, createActivityApi, benefitQueryApi } from '../../public/bPromiseApi/index';
import Taro from '@tarojs/taro';
import moment from 'moment';
import { isEmpty, matchNum, matchTime } from '../utils/index';

export const TITLE = "TITLE"; // 顶部的标题
export const SET_DATA = "SET_DATA"; // 通过id保存游戏配置数据
export const SET_URL = "SET_URL";// 保存创建成功后的活动url
export const SET_VALUE = "SET_VALUE"; // input框的输入值变化
const levelConfig = {
    "1":{ level:'1' },
    "2":{ level:'2' },
    "3":{ level:'3' },
};
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
        console.log('newData', newData, newData.game_config, data);
        const gameConfig = JSON.parse(newData.game_config || '{}');
        newData.activeUrl = decodeURIComponent(data.data[0].active_url);
        newData.activeName = data.data[0].active_name;
        newData.subTitle = data.data[0].sub_title;
        newData.gameNumber = data.data[0].game_number || gameConfig.reviveTimes;
        newData.maxShareNum = gameConfig.maxShareNum;
        newData.gameTask = gameConfig.gameTask;
        newData.gameLevel = gameConfig.gameLevel && gameConfig.gameLevel.level;
        newData.collectType = gameConfig.collectType;
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
            ///
            newData.goods = gameConfig.goods;
            newData.maxCollectNum = gameConfig.maxCollectNum;
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
        // 判断收藏商品是否符合条件
        let toastTitle = '';
        if (!isEmpty(newArgs.gameTask)) {
            const regPos = /^\d+$/; // 非负整数
            if(newArgs.gameTask.includes('collect')) {
                if (isEmpty(newArgs.collectType)) {
                    toastTitle = '请选择随机推荐或指定商品';
                } else if (!regPos.test(newArgs.maxCollectNum)) {
                    toastTitle = '最大收藏次数须是非负整数';
                } else if(newArgs.maxCollectNum > newArgs.goods.length) {
                    toastTitle = '最大收藏次数要小于商品数量';
                }
            } else if(newArgs.gameTask.includes('share')) {
                if (!regPos.test(newArgs.maxShareNum)) {
                    toastTitle = '最大分享次数须是非负整数';
                }
            }
        }
        // 判断必填项
        if (isEmpty(newArgs.activeName) || isEmpty(newArgs.subTitle) || isEmpty(newArgs.startDate) || isEmpty(newArgs.endDate) || isEmpty(newArgs.couponData) || isEmpty(newArgs.gameLevel)) {
            toastTitle = '必填项不能为空';
        }
        if (toastTitle) {
            Taro.showToast({
                title: toastTitle,
                duration: 2000,
            });
            return;
        }
        const gameConfig = {
            maxCollectNum:newArgs.maxCollectNum,
            goods:newArgs.goods,
            maxShareNum:newArgs.maxShareNum,
            gameTask:newArgs.gameTask,
            gameLevel:levelConfig[newArgs.gameLevel],
            reviveTimes:newArgs.gameNumber,
            collectType:newArgs.collectType,
        };
        delete newArgs.maxCollectNum;
        delete newArgs.goods;
        delete newArgs.maxShareNum;
        delete newArgs.gameTask;
        delete newArgs.gameLevel;
        delete newArgs.collectType;
        newArgs.gameConfig = JSON.stringify(gameConfig);
        newArgs.activeRewards = JSON.stringify(newArgs.activeRewards);// 优惠卷
        newArgs.operationType = operationType;// 操作类型
        newArgs.activeUrl = encodeURIComponent(newArgs.activeUrl);// 活动地址
        newArgs.activeID = getState().hotReducer.activityID;
        console.log('newArgs:', newArgs);
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
