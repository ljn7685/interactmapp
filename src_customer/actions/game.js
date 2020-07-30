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
    ADD_PRIZE,
    ADD_PRIZE_TIP,
    SET_JOIN_GAME,
    SET_REWARDS,
} from "../constants/game";
import { api } from "../../public/util/api";
import { getCloud } from "mapp_common/utils/cloud";
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

export const setRewards = (rewards) => {
    return { type: SET_REWARDS, rewards };
};

export const setJoinGame = () => {
    return { type: SET_JOIN_GAME };
};

export const setFavorShop = () => {
    return { type: SET_FAVOR_SHOP };
};

export const AddPrize = (index) => {
    return { type: ADD_PRIZE, index };
};

export const AddPrizeTip = () => {
    return { type: ADD_PRIZE_TIP };
};

function tbShopFavor(userinfo) {
    return new Promise((resolve, reject) => {
        my.tb.checkShopFavoredStatus({
            id: userinfo.seller_id,
            success: (res) => {
                console.log("favor status", res);
                if (res.isFavor) {
                    reject(res);
                } else {
                    my.tb.favorShop({
                        id: userinfo.seller_id,
                        success: resolve,
                        fail: reject,
                    });
                }
            },
            fail: (res) => {
                console.log("favor status fail", res);
                reject(res);
            },
        });
    });
}

export const favorShop = (userinfo, cb) => {
    console.log("favorshop", userinfo.active_id);
    return (dispatch) => {
        tbShopFavor(userinfo)
            .then((res) => {
                console.log("关注店铺");
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
                        dispatch(addGametimes());
                        cb && cb();
                    },
                    errCallback: (err) => {
                        console.log(err);
                    },
                });
            })
            .catch((res) => {
                Taro.showToast({
                    title: "关注店铺失败",
                    icon: "fail",
                    duration: 2000,
                });
            });
    };
};

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
const queryPrizes = (userinfo, appid) => {
    return getCloud()
        .topApi.invoke({
            api: "alibaba.benefit.query",
            data: {
                ename: userinfo.ename,
                app_name: `promotioncenter-${appid}`,
            },
        })
        .then((res) => {
            console.log("query prize", res);
            return res;
        })
        .catch((res) => {
            console.log("query prize fail", res);
            return res;
        });
};
const draw = (userinfo, appid) => {
    return new Promise((resolve, reject) => {
        getCloud()
            .topApi.invoke({
                api: "alibaba.benefit.draw",
                data: {
                    ename: userinfo.ename,
                    app_name: `promotioncenter-${appid}`,
                },
            })
            .then((res) => {
                console.log(JSON.stringify(res));
                if (res.result.result_success) {
                    resolve(res.prize_id);
                } else {
                    reject(res);
                }
            })
            .catch((e) => {
                console.log(e.message);
                reject(e);
            });
    });
};
const authorizeBenefit = () => {
    return new Promise((resolve, reject) => {
        my.authorize({
            scopes: "scope.benefitSend",
            success: (res) => {
                console.log("authorize success", JSON.stringify(res));
                resolve(res);
            },
            fail(res) {
                console.log("authorize fail", JSON.stringify(res));
                reject(res);
            },
        });
    });
};
export const drawPrize = (userinfo, appid, cb) => {
    return async (dispatch) => {
        try {
            await authorizeBenefit();
            const queryInfo = await queryPrizes(userinfo, appid);
            dispatch(setRewards(queryInfo.result.datas));
            const prize_id = await draw(userinfo, appid);
            api({
                apiName: "aiyong.interactc.user.data.update",
                method: "/interactive/updateInterActCData",
                args: {
                    game_stage: 3,
                    active_id: userinfo.active_id,
                    prize_id,
                },
                callback: async (res) => {
                    console.log("~~~~~~~~~~~~~~~~~~~~", res, prize_id);
                    if (queryInfo.result.datas.length === 1) {
                        dispatch(AddPrize(0));
                    } else {
                        dispatch(AddPrizeTip());
                    }
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
