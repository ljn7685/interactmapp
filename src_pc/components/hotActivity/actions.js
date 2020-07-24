import Taro from "@tarojs/taro";
import { api } from '../../public/util/api';

export const TITLE = "TITLE"; //顶部的标题
export const SET_DATA = "SET_DATA"; //通过id保存游戏配置数据

/**
 * 改变顶部标题
 * @param {*} values 
 */
export const changeTitleAction = (title, titleType, activityID, operType) => {
    console.log('dedededede', title, titleType, activityID)
    return {
        type: TITLE,
        title: title,
        titleType: titleType,
        activityID: activityID, 
        operType: operType
    }
}
/**
 * 存储修改的数据
 * @param {*} data 
 */
export const setEditData = (data)=>{
    return {
        type: SET_DATA,
        data: data
    }
}
/**
 * 修改游戏的时候，，通过游戏id拿到
 * @param {*} id 
 */
export const getActivityByIdAction = (id, operType)=>{
    //通过id拿到游戏数据
    return (dispatch) =>{
        api({
            apiName:'aiyong.interactb.user.activity.get',
            method:'/interactive/getDataById',
            args: {
                'activeID':id
            },
            callback:res=>{
                console.log('ididiididid',res)
                dispatch(setEditData(res.data, id));
                dispatch(changeTitleAction(operType + '丘比特之箭活动', 'create', id, operType))
            }
        })
    }

}
