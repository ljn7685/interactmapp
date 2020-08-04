import Taro from '@tarojs/taro';
import moment from 'moment';
/**
 * 判断是否为空，空格，空字符串， undefined,长度为0的数组、对象都为空
 * @param {*} value 
 */
export const isEmpty = (value) => {
    if (value === undefined || value === '' || value === null) {
        return true
    }
    if (typeof (value) === 'string') {
        return !Boolean(value.trim());//去掉空格后，是否为空
    }
    if (typeof (value) === 'object') {
        for (let i in value) {
            return false
        }
        return true
    }
    return false
}
/**
 * 时间校验
 * @param {*} type 
 */
export const matchTime = (type) => {
    for (let i = 0; i < type.length; i++) {
        let res = type[i].match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);
        if (res == null) {
            Taro.showModal({
                title: '请输入正确的时间格式，如2020-01-01',
                showCancel: false,
                confirmText: '确定'
            })
            return false;
        }
        let time = new Date(res[0]);//转成时间戳
        let result = (time.getFullYear() == res[1] && (time.getMonth() + 1) == res[3] && time.getDate() == res[5]);
        if (!result) {
            Taro.showModal({
                title: '请输入正确的时间',
                showCancel: false,
                confirmText: '确定'
            })
            return false;
        }
    }
    if (moment(type[1]).unix() < moment(type[0]).unix()) {
        Taro.showToast({
            title: '开始时间不能大于结束时间',
            duration: 2000
        })
        return false;
    }
    return true;
}
/**
 * 校验是否非负整数
 * @param {*} value 
 */
export const matchNum = (value) => {
    var regPos = /^\d+$/; // 非负整数
    if (regPos.test(value)) {
        return true
    } else {
        Taro.showToast({
            title: '活动次数为非负整数',
            duration: 2000
        })
        return false;
    }
}