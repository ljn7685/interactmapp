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
    SET_JOIN_GAME,
    SET_REWARDS,
} from "../constants/game";
import { api } from "../../public/util/api";
import { getCloud } from "mapp_common/utils/cloud";
import Taro from "@tarojs/taro"

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

export const AddPrize = (prize_id) => {
    return { type: ADD_PRIZE, prize_id };
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
const draw = (userinfo, appid, cb) => {
    my.authorize({
        scopes: "scope.benefitSend",
        success: (res) => {
            console.log(JSON.stringify(res));
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
                        cb && cb(res.prize_id);
                    }
                })
                .catch((e) => {
                    console.log(e.message);
                });
        },
        fail(res) {
            console.log("fail", res);
        },
    });
};
export const drawPrize = (userinfo, appid, cb) => {
    return (dispatch) => {
        draw(userinfo, appid, (prize_id) => {
            api({
                apiName: "aiyong.interactc.user.data.update",
                method: "/interactive/updateInterActCData",
                args: {
                    game_stage: 3,
                    active_id: userinfo.active_id,
                    prize_id,
                },
                callback: (res) => {
                    console.log("~~~~~~~~~~~~~~~~~~~~", res, prize_id);
                    queryPrizes(userinfo, appid).then((res) => {
                        dispatch(setRewards(res.result.datas));
                        dispatch(AddPrize(prize_id));
                        cb && cb();
                    });
                },
                errCallback: (err) => {
                    console.log(err);
                },
            });
        });
    };
};
