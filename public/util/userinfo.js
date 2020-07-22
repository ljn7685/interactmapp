import { api, entry, initphpSessionIdDeferred, authDeferred, testUser } from "./api";
import { ENV } from "@/constants/env";
import { getDeferred, isEmpty, isIDE, showConfirmModal, NOOP } from "./index";
import { setUserInfo, getUserInfo } from "./userInfoChanger";
import { events } from "mapp_common/utils/eventManager";
import { storage } from "mapp_common/utils/storage";
import Taro from "@tarojs/taro";
export const userInfoDeferred = getDeferred();

export const initUserInfoFromCache = () => {
    let cache = storage.getItemSync('userInfo');
    console.warn("initUserInfoFromCache", cache);
    setUserInfo(cache);
};

/*
 * @Description 接入tc/user，获取用户信息
*/
export const userInfoInit = (callback = NOOP) => {
    initphpSessionIdDeferred();
    authorize().then(res => {
        const nick = !isEmpty(res) ? res.nickName : testUser.nickName;
        entry({
            callback:(userInfoEntry) => {
                console.warn("userInfoEntry", userInfoEntry);
                setUserInfo(userInfoEntry);
                fetchUserInfoFromTcUser({
                    nick,
                    callback:(newUserInfo) => {
                        // 添加一些便于使用的userInfo相关内容
                        // 判断是否是子账号
                        if (!isEmpty(newUserInfo.sub_nick)) {
                            newUserInfo.subUserNick = newUserInfo.sub_nick;
                        }
                        console.warn("fetchUserInfoFromTcUser", newUserInfo);
                        setUserInfo(newUserInfo);
                        userInfoDeferred.resolve();
                        events.userInfoCallback.emit(newUserInfo);
                        callback(newUserInfo);
                    },
                });
            },
        });
    });
};


/**
 * 授权失败 并弹出对话框 可以选择退出或者重新授权 重新授权会清除授权
 * @param location
 * @param err
 */
async function authFailed (location, err) {
    console.error('auth failed', location, err);
    err = JSON.stringify(err);
    let retry = await new Promise((resolve) => {
        showConfirmModal({
            content: '授权失败' + location + err,
            cancelText: '退出',
            confirmText: "重试",
            onCancel: () => {
                my.qn.returnData();
                resolve(false);
            },
            onConfirm: () => {
                my.qn.cleanToken({
                    success: (res) => {
                        Taro.showToast({ icon: 'success', title: '清除授权成功' + JSON.stringify(res) });
                        resolve(true);
                    },
                    fail: (res) => {
                        Taro.showToast({ icon: 'fail', title: '清除授权失败' + JSON.stringify(res) });
                        resolve(true);
                    },
                });

            },
        });
    });
    if (retry) {
        return authorize();
    }else{
        return;
    }
}

/**
 * 授权 并拿到用户信息
 * @returns {Promise<{access_token: string, nickName: string}|{[p: string]: *}|{access_token: string, nickName: string}|*|undefined>}
 */
export async function authorize () {
    if (isIDE()) {
        console.error('auth dev mode',);
        authDeferred.resolve(testUser);
        return testUser;
    }
    try {
        let { authRes, authErr } = await new Promise((resolve) => {
            my.authorize({
                scopes: 'scope.userInfo',
                success: (authRes) => {
                    console.warn('authorize', authRes);
                    setUserInfo({ accessToken: authRes.accessToken });
                    resolve({ authRes });
                },
                fail: (authErr) => {
                    console.log(authErr)
                    resolve({  authErr });
                },
            });
        });
        if (authErr) {
            return   authFailed('authorize_fail', authErr);
        }
        authDeferred.resolve(authRes);

        let { userRes, userErr } = await new Promise((resolve) => {
            my.getAuthUserInfo({
                success: (userRes) => {
                    console.warn('getAuthUserInfo', userRes);
                    resolve({ userRes });
                },
                fail: (userErr) => {
                    console.log(userErr)
                    resolve({ userErr });
                },
            });
        });

        /**
         * 这个地方可能是accessToken失效
         * 具体逻辑是这样的:
         *
         * 第一次进入小程序调用`my.authorize` 会得到一个accessToken 然后千牛会存在本地
         * 然后下次进来判断本地有没有 如果有 那就直接走success
         * 但是这个缓存里的accessToken是不一定有效的
         * 也就是虽然`my.authorize`走到了success 但是返回出来的accessToken在服务器看来是无效的
         * 然后这个`my.getAuthUserInfo`走到fail 大概率就是accessToken失效了 需要重新授权
         * 重新授权就是调用my.clearToken将本地的accessToken缓存清除 然后调my.authorize 重新授权
         */
        if (userErr) {
            return authFailed('getAuthUserInfo_fail', userErr);
        }
        return setUserInfo(userRes);
    }catch (e) {
        return authFailed('authorize throw', e);
    }
};

/*
 * @Description 从tcUser获取用户信息
*/
export const fetchUserInfoFromTcUser = ({ callback, nick  }) => {
    let args = { isqap: 1, slot: 'miniapp' };
    if (isIDE()) {
        args.nick = testUser.nickName;
        args.access_token = testUser.access_token;
    }
    api({
        apiName:ENV.userApiName,
        method:ENV.userMethod,
        args,
        callback:res => {
            const newUserInfo = res;
            // 解决信息中没有 sellerType、avatar 在entry中获取不到的问题
            if(!isEmpty(res.userInfo)) {
                Object.assign(newUserInfo, res.userInfo);
            }
            callback(newUserInfo);
        }
    });
};


/**
 * 是否为初级版用户
 * @returns {boolean}
 */
export const isNotVip = () => {
    return getUserInfo().vipFlag == 0;
};

export const getMainUserName = () => {
    return getUserInfo().userNick.split(':')[0];
};


