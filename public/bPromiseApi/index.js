import { api, invokeTop } from '../util/api';
import { descReplace } from '../util';
/**
 * 获取用户创建的全部信息
 * @param {*} args 
 */
export const getActivityDataApi = (args) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: 'aiyong.item.interactb.user.createact.get',
            method: '/interactive/newGetUserCreateInterActData',
            args: args,
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
};
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
                reject(err);
            },
        });
    });
};
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
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
};
/**
 * 通过id拿到的游戏数据
 * @param {*} args 
 */
export const getActivityInfoIdApi = (args) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: 'aiyong.interactb.user.activity.get',
            method: '/interactive/getDataById',
            args:args,
            callback: res => {
                resolve(res);
            },
            errCallback: err => {
                reject(err);
            },
        });
    });
};

/**
 * 查询发奖奖池的信息
 * @param {*} args 
 */
export const benefitQueryApi = (args) => {
    return new Promise((resolve, reject) => {
        invokeTop({
            api:'alibaba.benefit.query',
            params:args,
            callback:res => {
                resolve(res);
            },
            errCallback:err => {
                reject(err);
            },
        });
    });
};
/**
 * 获取在售商品列表
 * @param {*} args 
 */
export const getSaleGoodsApi = (args) => {
    return new Promise((resolve, reject) => {
        invokeTop({
            api:'taobao.items.onsale.get',
            params:args,
            callback:(res) => {
                res.items && res.items.forEach(item => {
                    item.title = descReplace(item.title);
                });
                resolve(res);
            },
            errCallback:(err) => {
                reject(err);
            },
        });
    });
    
};
/**
 * 订购关系查询 
 * @param {*} args 
 */
export const getSubscribeAPI = (args) => {
    return new Promise((resolve, reject) => {
        invokeTop({
            api:'taobao.vas.subscribe.get',
            params:args,
            callback:(res) => {
                resolve(res);
            },
            errCallback:(err) => {
                reject(err);
            },
        });
    });
};

