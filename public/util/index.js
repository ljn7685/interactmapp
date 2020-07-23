import Taro from "@tarojs/taro";
import { ENV } from "@/constants/env";

export const NOOP = () => {};

/**
 * 是否是ide 最好把这个在上传的时候改成return false 鬼知道千牛的my.qn里有什么 不同人还不一样的
 * @returns {boolean}
 */
export function isIDE () {
    if (ENV.device === "pc") {
        return !my.qn.openPlugin;
    }
    if (ENV.device === "mobile") {
        return my.isIDE;
    }
}

/**
 * 判断一个东西是不是空 空格 空字符串 undefined 长度为0的数组及对象会被认为是空的
 * @param key
 * @returns {boolean}
 */
export function isEmpty (key) {
    if (key === undefined || key === '' || key === null) {
        return true;
    }
    if (typeof (key) === 'string') {
        key = key.replace(trimReg, '');
        if (key == '' || key == null || key == 'null' || key == undefined || key == 'undefined') {
            return true;
        } else{
            return false;
        }
    } else if (typeof (key) === 'undefined') {
        return true;
    } else if (typeof (key) === 'object') {
        for (let i in key) {
            return false;
        }
        return true;
    } else if (typeof (key) === 'boolean') {
        return false;
    }
}

/**
 * 显示二次确认弹窗
 * @param onConfirm 点击确认的回调
 * @param onCancel 点击取消的回调
 */
export function showConfirmModal (
    {
        title = '温馨提示',
        content,
        confirmText = '确定',
        cancelText = '取消',
        onConfirm = NOOP,
        onCancel = NOOP,
        showCancel = true,
    }) {
        Taro.showModal({
            title,
            showCancel,
            content,
            confirmText,
            cancelText,
            success:(res) => {
                if (res.cancel || res.confirm == false) {
                    onCancel();
                }else  {
                    onConfirm();
                }
            },
        });
}

/**
 * 构造一个deferred对象 相当于一个resolve reject 外置的promise 可以预先生成这个promise 然后等待这个promise被外部resolve
 * @returns {Promise<unknown>}
 */
export function getDeferred ()  {
    let resolve, reject;
    let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

// 动画延时
export function sleep (time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
