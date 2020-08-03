import {getActivityInfoIdApi} from '../../public/bPromiseApi/index';

export const TITLE = "TITLE"; //顶部的标题
export const SET_DATA = "SET_DATA"; //通过id保存游戏配置数据
export const SET_URL = "SET_URL";//保存创建成功后的活动url

/**
 * 改变顶部标题
 * @param {*} values 
 */
export const changeTitleAction = (title, titleType, activityID, operType, activityData) => {
    return {
        type: TITLE,
        title: title,
        titleType: titleType,
        activityID: activityID,
        operType: operType,
        activityData: activityData
    }
}
/**
 * 保存活动创建成功的id
 * @param {*} data 
 */
export const setActivityUrlAction = (activityUrl) => {
    return {
        type: TITLE,
        activityUrl: activityUrl
    }
}
/**
 * 修改游戏的时候，，通过游戏id拿到
 * @param {*} id 
 */
export const getActivityByIdAction = (id, operType) => {
    //通过id拿到游戏数据
    return async(dispatch) => {
        let data = await getActivityInfoIdApi({'activeID': id});
        if(data.code == 200){
            dispatch(changeTitleAction(operType + '丘比特之箭活动', 'hotActivity#create', id, operType, data.data))
        }
    }
}
