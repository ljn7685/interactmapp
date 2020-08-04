import { api } from '../util/api';
/**
 * 获取用户创建的全部信息
 * @param {*} args 
 */
export const getActivityDataApi = (args) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: 'aiyong.interactb.user.createact.get',
            method: '/interactive/getUserCreateInterActData',
            args: args,
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(res)
            }
        })
    })
}
/**
 * 创建游戏，修改游戏
 * @param {*} args 
 */
export const createActivityApi = (args) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: 'aiyong.interactb.activity.create',
            method: '/interactive/creatInteract',
            args: args,
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err)
            }
        })
    })
}
/**
 * 获取具体活动数据
 * @param {*} args 
 */
export const getDataByIdApi = (args) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: 'aiyong.interactb.activity.data.get',
            method: '/interactive/getInteractData',
            args: args,
            callback: res => {
                resolve(res)
            },
            errCallback: err => {
                reject(err)
            }
        })
    })
}

export const getActivityInfoIdApi = (args) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: 'aiyong.interactb.user.activity.get',
            method: '/interactive/getDataById',
            args:args,
            callback: res => {
                resolve(res)
            },
            errCallback: err=>{
                reject(err)
            }
        })
    })
}
