import { api } from "../../public/util/api";
import Taro from "@tarojs/taro";
import { getUserInfo } from "../../public/util/userInfoChanger";

export const ADD_GAMETIMES = 'ADD_GAMETIMES';
export const MINUS_GAMETIMES = 'MINUS_GAMETIMES';
export const SET_PRELOADED = 'SET_PRELOADED';
export const SET_ACTIVITY_ENDED = 'SET_ACTIVITY_ENDED';
export const SET_BEST_SCORE = 'SET_BEST_SCORE';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_FAVOR_SHOP = 'SET_FAVOR_SHOP';
export const SET_RECEIVE_REWARDS = 'SET_RECEIVE_REWARDS';
export const SET_JOIN_GAME = 'SET_JOIN_GAME';
export const COLLECT_GOOD_ITEM = 'COLLECT_GOOD_ITEM';
export const HELP_SHARE_USER = 'HELP_SHARE_USER';
export const TOGGLE_MUSIC_ENABLE = 'TOGGLE_MUSIC_ENABLE';

export const addGametimes = () => {
    return { type: ADD_GAMETIMES };
};

export const minusGametimes = () => {
    return { type: MINUS_GAMETIMES };
};

export const setPreloaded = (preloaded) => {
    return { type: SET_PRELOADED, preloaded };
};

export const setBestScore = (score) => {
    return { type: SET_BEST_SCORE, score };
};

export const setActivityEnded = (isEnded) => {
    return { type: SET_ACTIVITY_ENDED, isEnded };
};

export const setUserInfo = (userinfo) => {
    return { type: SET_USER_INFO, userinfo };
};

export const setJoinGame = () => {
    return { type: SET_JOIN_GAME };
};

export const setFavorShop = () => {
    return { type: SET_FAVOR_SHOP };
};

export const setReceiveRewards = () => {
    return { type: SET_RECEIVE_REWARDS };
};

export const collectGoodItem = (item) => {
    return { type: COLLECT_GOOD_ITEM, item };
};

export const helpShareUser = () => {
    return { type: HELP_SHARE_USER };
};

export const toggleMusicEnable = () => {
    return { type: TOGGLE_MUSIC_ENABLE };
};

/**
 * 淘宝关注店铺API
 * @param {*} userinfo
 */
function tbShopFavor (userinfo) {
    return new Promise((resolve, reject) => {
        my.tb.checkShopFavoredStatus({
            id: userinfo.seller_id,
            success: (res) => {
                console.log("favor status", res);
                if (res.isFavor) {
                    resolve(res);
                } else {
                    my.tb.favorShop({
                        id: userinfo.seller_id,
                        success: resolve,
                        fail: (res) => {
                            console.log(res);
                            reject({ msg: res.errorMessage });
                        },
                    });
                }
            },
            fail: (res) => {
                console.log("favor status fail", res);
                reject({ msg: "查询店铺关注状态失败！" });
            },
        });
    });
}
/**
 * 关注店铺action
 * @param {*} userinfo
 * @param {*} cb
 */
export const favorShop = (userinfo, cb) => {
    console.log("favorshop", userinfo.active_id);
    return (dispatch) => {
        tbShopFavor(userinfo)
            .then((res) => {
                console.log("关注店铺成功", res);
                api({
                    apiName: "aiyong.item.interactc.user.data.update",
                    method: "/interactive/updateInterActCData",
                    args: {
                        game_stage: 1,
                        active_id: userinfo.active_id,
                    },
                    callback: async (res) => {
                        console.log("~~~~~~~~~~~~~~~~~~~~", res);
                        dispatch(setFavorShop());
                        if (userinfo.is_follow) {
                            Taro.showToast({ title:'已经关注过店铺咯~' });
                        } else {
                            dispatch(addGametimes());
                        }
                        cb && cb();
                    },
                    errCallback: (err) => {
                        console.log(err);
                    },
                });
            })
            .catch((res) => {
                Taro.showToast({
                    title: res.msg,
                    icon: "fail",
                    duration: 2000,
                });
            });
    };
};
/**
 * 参与游戏action
 * @param {*} userinfo
 * @param {*} cb
 */
export const joinGame = (userinfo, cb) => {
    return (dispatch) => {
        api({
            apiName: "aiyong.item.interactc.user.data.update",
            method: "/interactive/updateInterActCData",
            args: {
                game_stage: 2,
                active_id: userinfo.active_id,
            },
            callback: (res) => {
                console.log("~~~~~~~~~~~~~~~~~~~~", res);
                dispatch(setJoinGame());
                cb && cb();
            },
            errCallback: (err) => {
                console.log(err);
            },
        });
    };
};
/**
 * 更新用户游戏次数API
 * @param {*} userinfo 
 */
export const updateGameNumberApi = (userinfo) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: "aiyong.item.interactc.user.data.update",
            method: "/interactive/updateInterActCData",
            args: {
                revive: true,
                active_id: userinfo.active_id,
            },
            callback: (res) => {
                if(res.code === 200) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            errCallback: (err) => {
                reject(err);
            },
        });
    });
};
/**
 * 用户更新游戏次数action
 * @param {*} userinfo
 * @param {*} cb
 */
export const addGameNumberAction = (userinfo, cb) => {
    return async (dispatch) => {
        try{
            const res = await updateGameNumberApi(userinfo);
            console.log("~~~~~~~~~~~~~~~~~~~~", res);
            dispatch(minusGametimes());
            cb && cb();
        } catch (err) {
            console.log('addGameNumberAction', err);
            Taro.showToast({ title:'更新游戏次数失败' });
        }
    };
};
const draw = (userinfo) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: "aiyong.interactc.benefit.send",
            method: "/interactive/benefitSend",
            args: {
                topNick: userinfo.seller_nick,
                ename: userinfo.ename,
            },
            callback: async (res) => {
                console.log(res);
                if (res.result_code === "SUCCESS" && res.result_success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            errCallback: (err) => {
                reject(err);
            },
        });
    });
};
/**
 * 获得奖励API
 * @param {*} userinfo 
 */
const receiveRewardsApi = (userinfo) => {
    return new Promise((resolve, reject) => {
        api({
            apiName: "aiyong.item.interactc.user.data.update",
            method: "/interactive/updateInterActCData",
            args: {
                game_stage: 3,
                active_id: userinfo.active_id,
            },
            callback: (res) => {
                if(res.code === 200) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            errCallback: (err) => {
                reject(err);
            },
        });
    });
};
/**
 * 抽奖action
 * @param {*} userinfo
 * @param {*} cb
 */
export const drawPrize = (userinfo, cb) => {
    return async (dispatch) => {
        try {
            await draw(userinfo);
            await receiveRewardsApi(userinfo);
            dispatch(setReceiveRewards());
            cb && cb();
        } catch (err) {
            Taro.showToast({
                title: err.msg || "抽奖失败",
                icon: "fail",
                duration: 2000,
            });
        }
    };
};
/**
 * 收藏商品API
 * @param {*} item
 * @param {*} gameConfig
 */
export function collectGoodApi (item, gameConfig) {
    return new Promise((resolve, reject) => {
        api({
            apiName: "aiyong.item.interactc.user.data.update",
            method: "/interactive/updateInterActCData",
            args: {
                operType: 1,
                goodID: item.num_iid,
                maxCollectNum: gameConfig.maxCollectNum,
                active_id: getUserInfo().active_id,
            },
            callback: (res) => {
                if (res.code === 200) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            errCallback: (err) => {
                reject(err);
            },
        });
    });
}
/**
 * 分享助力API
 * @param {*} item
 * @param {*} gameConfig
 */
export function shareHelpApi (fromNick, gameConfig) {
    return new Promise((resolve, reject) => {
        api({
            apiName: "aiyong.item.interactc.user.data.update",
            method: "/interactive/updateInterActCData",
            args: {
                operType: 2,
                fromNick,
                maxShareNum: gameConfig.maxShareNum,
                active_id: getUserInfo().active_id,
            },
            callback: (res) => {
                if (res.code === 200) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            errCallback: (err) => {
                reject(err);
            },
        });
    });
}
/**
 * 分享助力Action
 * @param {*} fromNick
 * @param {*} gameConfig
 */
export function helpShareUserAction (fromNick, gameConfig, callback) {
    return async (dispatch) => {
        try {
            const res = await shareHelpApi(fromNick, gameConfig);
            dispatch(helpShareUser());
            callback && callback({ result:true, msg:res.msg || '' });
        } catch (error) {
            dispatch(helpShareUser());
            callback && callback({ result:false, msg:error.msg || '' });
        }
    };
}
/**
 * 收藏商品action
 * @param {*} item
 */
export function collectGoodAction (item, gameConfig) {
    return async (dispatch) => {
        my.tb.collectGoods({
            id: item.num_iid,
            success: (res) => {
                console.log("success - " + JSON.stringify(res));
                collectGoodApi(item, gameConfig)
                    .then(() => {
                        dispatch(collectGoodItem(item));
                        dispatch(addGametimes());
                    })
                    .catch((err) => {
                        Taro.showToast({
                            title: err.msg || "收藏商品失败",
                            icon: "fail",
                            duration: 2000,
                        });
                    });
            },
            fail: (error) => {
                console.log("fail - ", error);
                Taro.showToast({
                    title: (error && error.message) || "收藏商品失败",
                    icon: "fail",
                    duration: 2000,
                });
            },
        });
    };
}
