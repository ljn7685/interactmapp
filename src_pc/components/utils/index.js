import Taro from '@tarojs/taro';
/**
 * 判断是否为空，空格，空字符串， undefined,长度为0的数组、对象都为空
 * @param {*} value 
 */
export const isEmpty = (value) => {
    if (value === undefined || value === '' || value === null) {
        return true;
    }
    if (typeof (value) === 'string') {
        return !Boolean(value.trim());// 去掉空格后，是否为空
    }
    if (typeof (value) === 'object') {
        for (let i in value) {
            return false;
        }
        return true;
    }
    return false;
};
/**
 * 校验是否非负整数
 * @param {*} value 
 */
export const matchNum = (value, name = "活动次数") => {
    var regPos = /^\d+$/; // 非负整数
    if (regPos.test(value) && Number(value) > 0) {
        return true;
    } else {
        Taro.showToast({
            title: name + '为正整数',
            duration: 2000,
        });
        return false;
    }
};