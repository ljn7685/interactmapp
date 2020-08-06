import {
    ADD_GAMETIMES,
    MINUS_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
    SET_ACTIVITY_ENDED,
    SET_USER_INFO,
    MINUS_REVIVE_TIMES,
    RESET_REVIVE_TIMES,
    SET_FAVOR_SHOP,
    SET_RECEIVE_REWARDS,
    SET_JOIN_GAME,
} from "../constants/game";
import { api } from "../../public/util/api";
import Taro from "@tarojs/taro";

export const addGametimes = () => {
    return { type: ADD_GAMETIMES };
};

export const minusGametimes = () => {
    return { type: MINUS_GAMETIMES };
};

export const minusReviveTimes = () => {
    return { type: MINUS_REVIVE_TIMES };
};

export const resetReviveTimes = () => {
    return { type: RESET_REVIVE_TIMES };
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

/**
 * 淘宝关注店铺API
 * @param {*} userinfo
 */
function tbShopFavor(userinfo) {
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
                            reject({
                                msg:
                                    typeof res.error === "string"
                                        ? res.error
                                        : "关注店铺失败",
                            });
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
                    apiName: "aiyong.interactc.user.data.update",
                    method: "/interactive/updateInterActCData",
                    args: {
                        game_stage: 1,
                        active_id: userinfo.active_id,
                    },
                    callback: (res) => {
                        console.log("~~~~~~~~~~~~~~~~~~~~", res);
                        dispatch(setFavorShop());
                        if (!userinfo.played) {
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
            apiName: "aiyong.interactc.user.data.update",
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
 * 用户复活action
 * @param {*} userinfo
 * @param {*} cb
 */
export const userRevive = (userinfo, cb) => {
    return (dispatch) => {
        api({
            apiName: "aiyong.interactc.user.data.update",
            method: "/interactive/updateInterActCData",
            args: {
                revive: true,
                active_id: userinfo.active_id,
            },
            callback: (res) => {
                console.log("~~~~~~~~~~~~~~~~~~~~", res);
                dispatch(minusReviveTimes());
                cb && cb();
            },
            errCallback: (err) => {
                console.log(err);
            },
        });
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
                if (res.code === 200 && res.result_success) {
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
            api({
                apiName: "aiyong.interactc.user.data.update",
                method: "/interactive/updateInterActCData",
                args: {
                    game_stage: 3,
                    active_id: userinfo.active_id,
                },
                callback: async (res) => {
                    console.log("~~~~~~~~~~~~~~~~~~~~", res);
                    dispatch(setReceiveRewards());
                    cb && cb();
                },
                errCallback: (err) => {
                    console.log(err);
                    Taro.showToast({
                        title: "抽奖失败",
                        icon: "fail",
                        duration: 2000,
                    });
                },
            });
        } catch (e) {
            Taro.showToast({
                title: "抽奖失败",
                icon: "fail",
                duration: 2000,
            });
        }
    };
};
