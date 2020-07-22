import Taro from "@tarojs/taro";
import {  NOOP, isIDE, showConfirmModal, getDeferred, sleep, getUserInfo  } from "./index";
import { ENV } from "@/constants/env";
import { getCloud } from "mapp_common/utils/cloud";
import moment from "mapp_common/utils/moment";
export const authDeferred = getDeferred();

export const testUser = {
    nickName:'sinpo0',
    access_token:'50000001133ylSBZlJ0FkvATpCdChSipTwgifMnwDxxCc19572834WBstxpDg2qZsY6',
};

let phpSessionId = '';

/**
 * top请求调用 从小程序云
 * @param api
 * @param params
 * @param callback
 * @param errCallback
 */
export function invokeTop ({ api, params, callback, errCallback })  {
    let successFlag = 0;
    params = JSON.parse(JSON.stringify(params));
    Object.keys(params).map(key => {
        if (Array.isArray(params[key])) {
            params[key] = params[key].join(',');
        }
    });
    authDeferred.then(() => {
        getCloud().topApi.invoke({
            api: api,
            data: params,
        }).then((res) => {
            successFlag = 1;
            callback(res);
        }).catch((err) => {
            if (successFlag) {
                return;
            }
            errCallback(err);
        });
    });
};

/**
 * api方法 根据不同的环境会用不同的方法获取数据
 *  在目前调试时使用cookie写死的方法
 * @param host
 * @param method
 * @param args
 * @param callback
 * @param errCallback
 */
export function api (
    {
        host = ENV.hosts.default,
        apiName,
        method,
        args = {},
        callback = NOOP,
        errCallback = NOOP,
        ...rest
    }) {
    if (Object.keys(args)) {
        args = {
            ...args,
            trade_source: 'TAO',
        };
    }
    let newArgs = {...args };
    applicationApi({
        args: newArgs,
        apiName: apiName,
        path: method,
        ...rest,
        callback: (res) => {
            console.log('newArgs~~~~~~~~~', res)
            if (checkLogin(res)) {
                success(res, apiName, 'application', newArgs);
            } else {
                error(res, apiName, 'application', newArgs);
            }
        },
        errCallback: (res) => {
            if (checkLogin(res)) {
                error(res, apiName, 'application', newArgs);
            }
        },
    });

    /**
     * 检查是否是登录失效
     * @param resp
     * @returns {boolean}
     */
    function checkLogin (resp) {
        if (resp == 'fail' || resp && resp.code == 500 && resp.sub_code == 20003) {
            // 遇见错误时弹框提示   by Mothpro
            // session获取失败登录失效
            showConfirmModal({
                title: '温馨提示',
                content: '登录失效，请重新打开插件！' + JSON.stringify(resp),
                onConfirm: () => {
                    my.qn.returnData();
                },
                onCancel: () => {
                    errCallback(resp);
                },
            });
            return false;
        }
        return true;
    }

    /**
     * 成功
     * @param res
     */
    function success (res, api, from, req) {
        try {
            callback(res);

        }catch (e) {
            debugger;
            console.error('api-callback-error', formatError(e));
        }
    }

    /**
     * 失败
     * @param error
     */
    function error (error, api, from, req) {
        console.error(`%capi-${from}-error`, style.red, api, req, error);

        errCallback(error);
    }
};

let phpSessionIdDeferred = getDeferred();

export const initphpSessionIdDeferred = () => {
    phpSessionIdDeferred = getDeferred();
};

export const getphpSessionIdDeferred = () => {
    return phpSessionIdDeferred;
};

/**
 * 奇门接口
 * @param args
 * @param apiName
 * @param callback
 * @param errCallback
 */
export function applicationApi ({ args, apiName, path, method = 'POST', headers = {}, version = 1, callback, errCallback }) {
    phpSessionIdDeferred.then(() => {
        let _path = getUserInfo().userNick;
        !_path && (_path = path);
        !_path && (_path = '/');
        let isSuccess = false;
        if (args) {
            Object.keys(args).map(key => {
                if (args[key] === null || args[key] === undefined) {
                    delete args[key];
                }
            });
        }
        let data = {
            path: '#' + _path,
            method,
            headers,
            body: {
                api_name: apiName,
                phpSessionId: phpSessionId,
                version: version,
                ...args,

            },
        };
        getCloud().application.httpRequest(data).then(res => {
            isSuccess = true;
            let data = res;
            if (data.data) {
                data = data.data;
            }
            if (res === 'success') {
                callback(res);
                return;
            }
            // 外加method判断/newmitem/newGetRejectBaby
            try {
                data = JSON.parse(data);
            } catch (e) {
                errCallback(e);
                return;
            }
            callback(data);
        }).catch(error => {
            if (!isSuccess) {
                if (error instanceof Error) {
                    error = { message: error.message/* stack:error.stack */ };
                }
                errCallback(error);
            }
        });
    });
};

/**
 * 入口 取phpsessionid
 */
export async function entry ({ accessToken, callback = NOOP, errCallback = NOOP } = {}) {
    let args = {
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        slot: 'miniapp',
        from: 'qianniuIphone',
        api_name: ENV.entryApiName,
        version: 1,
        planet: ENV.planet,
        _access_token: accessToken,
    };
    if (isIDE()) {
        args.user_nick = testUser.nickName;
        args._access_token = testUser.access_token;
    }
    let res;
    let tryTime = 0;
    while (tryTime++ < 2) {
        res = await new Promise(resolve => {
            getCloud().application.httpRequest({
                path: '#',
                method: 'POST',
                body: { ...args },
            }).then(res => {
                resolve(res);
            }).catch(error => {
                Taro.showToast({ icon: 'fail', title: '登录失败 重试中..' + tryTime });
                console.error('entry-error', {
                    args,
                    error,
                });
                resolve(false);
            });
        });
        if (res) {
            break;
        }
        await sleep(500);
    }
    if (!res) {
        showConfirmModal({ content: '登录失败 请稍后再试..', showCancel:false });
        errCallback();
        return;
    }

    Taro.showToast({ title: '登录成功' });
    let data = res;
    if (data.data) {
        data = data.data;
    }
    try {
        data = JSON.parse(data);
    } catch (e) {
        console.error('entry-parse-error', e);
    }

    console.warn('ertry-success', args, data);
    phpSessionId = data.phpSessionId;
    phpSessionIdDeferred.resolve(phpSessionId);
    let userInfo = {
        userId: data.user_id,
        userNick: data.nick,
    };
    callback(userInfo);
}
