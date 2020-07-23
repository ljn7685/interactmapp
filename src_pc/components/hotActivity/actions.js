import Taro from "@tarojs/taro";

export const TITLE = "TITLE"; //顶部的标题
export const SET_DATA = "SET_DATA"; //通过id保存游戏配置数据

/**
 * 改变顶部标题
 * @param {*} values 
 */
export const changeTitleAction = (title, titleType) => {
    return {
        type: TITLE,
        title: title,
        titleType: titleType
    }
}

export const demo = (data)=>{
    return {
        type: SET_DATA,
        data: data
    }
}
/**
 * 修改游戏的时候，，通过游戏id拿到
 * @param {*} id 
 */
export const getActivityByIdAction = (id)=>{
    //通过id拿到游戏数据
    return (dispatch) =>{
        dispatch(demo(id))
    }
}
