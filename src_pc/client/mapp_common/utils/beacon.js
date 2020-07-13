import { getCurrentVersionNum } from "mapp_common/utils/version";
import { getCurrentPageName } from "mapp_common/utils/index";
import { Logger } from "mapp_common/utils/logger";
import { getUserInfo } from "mapp_common/utils/userInfoChanger";
import { ENV } from "@/constants/env";
import { getSystemInfo } from "mapp_common/utils/systemInfo";
import { getCloud } from "mapp_common/utils/cloud";
import { getphpSessionIdDeferred } from "mapp_common/utils/api";
import { userInfoDeferred } from "mapp_common/utils/userInfo";
import { getSettings } from "mapp_common/utils/settings";
// 大部分降级埋点（beacon_simple）的时候的关键不降级埋点 
const importantEventCode = [
    'pay-click-mo',
    'pay-click-pc',
    'zdtcdjmdmobile',
    'zdtcdjmd',
];
/**
 * 商品的封装过的埋点
 * flag为false 就是不区分初高级
 */
export const itemBeacon = ({
    page = getCurrentPageName(),
    func,
    flag = true,
    ...rest
}) => {
    newBeacon({
        page,
        func,
        flag,
        project: 'TD20200117150137',
        ...rest,
    });
};

/**
 * 交易的封装过的埋点
 */
export const tradeBeacon = ({
    page = getCurrentPageName(),
    func,
    flag = true,
    ...rest
}) => {
    newBeacon({
        page,
        func,
        flag,
        project: 'TD20191206151236',
        ...rest,
    });
};

/**
 * 埋点统一方法
 * @param page
 * @param func
 * @param project
 * @param rest
 */
export function newBeacon (
    {
        page = getCurrentPageName(),
        func,
        flag,
        project,
        ...rest
    }) {
    userInfoDeferred.then(() => {
        let vipFlag = +!!(getUserInfo().vipFlag);
        let vipFlagStr = vipFlag ? 'vip' : 'free';
        let e;
        if (flag) {
            e = [page, func, vipFlagStr].join('-');
        } else {
            e = [page, func].join('-');
        }
        beacons({
            n: getUserInfo().userNick,
            e: e,
            p: project,
            m1: page,
            m2: func,
            d1: getUserInfo().vipFlag,
            d2: getCurrentVersionNum(),
            ...rest,
        });
    });
}
/**
 * 618运营埋点
 * @param {*} type 
 * @param {*} pid 
 * @param {*} level 
 */
export const operateBeacon = (type,level)=> {
    let vipFlag = getUserInfo().vipFlag;
    const { app, marketingParent, platform: where } = ENV;
    const { platform } = getSystemInfo();
    let beaconObj = {
        n: getUserInfo().userNick,
        e: `${where}_${app}_${platform}_${vipFlag ? level+'_'+type : type+'_free'}`,
        p: marketingParent,
        m1: getCurrentPageName(),
        m2: level,
        d1: getUserInfo().vipFlag,
        d2: getCurrentVersionNum(),
    };
    beacons(beaconObj);
}

/*
 * @Description 运营埋点
*/
export const marketingBeacon = (type, pid, level) => {
    const { app, marketingParent, platform: where } = ENV;
    const { platform } = getSystemInfo();
    let beaconObj = {
        n: getUserInfo().userNick,
        e: `${where}_${app}_${platform}_${level}_${type}`,
        p: marketingParent,
        m1: getCurrentPageName(),
        m2: pid,
        d1: getUserInfo().vipFlag,
        d2: getCurrentVersionNum(),
    };
    beacons(beaconObj);
};

/**
 * 埋点
 * @type {Object}
 */
export function beacons (args) {
    // 埋点拦截
    if (!canBeacon(args)) {
        return;
    }
    args.m6 = ENV.platform;
    args.t = new Date().getTime();
    getphpSessionIdDeferred().then(phpSessionId => {
        let data = {
            path : 'beacon',
            method: 'POST',
            body:{
                api_name:'aiyong.mcs.1.gif',
                version:'1',
                phpSessionId:phpSessionId,

                ...args,
            },
        };
        getCloud().application.httpRequest(data).then(res => {
            Logger.debug('beacons', args);
        }).catch(e => Logger.warn(e));
    });

};
/**
 * 降级埋点拦截
 * @Author ZW
 * @date   2020-05-22T22:09:03+0800
 * @param  {Object}                 args 埋点对象信息
 * @return {Boolean}                     是否可以进行埋点
 */
const canBeacon = (args = {}) => {
    let downGradeInfo = getSettings().downGradeInfo;
    // 埋点事件名
    let eventCode = args.e || '';
    if (downGradeInfo) {
        // 全部埋点的降级
        if (downGradeInfo.all_beacon_disabled == 1) {
            return false;
        }
        // 只保留关键埋点的降级
        if (downGradeInfo.beacon_simple == 1 && importantEventCode.indexOf(eventCode) == -1) {
            return false;
        }
    }
    return true;
}
export function beacon () {

}
