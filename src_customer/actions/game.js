import {
    MODIFY_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
    SET_ACTIVITY_ENDED,
    SET_USER_INFO,
    MODIFY_REVIVE_TIMES,
    SET_FAVOR_SHOP,
    ADD_PRIZE,
} from "../constants/game";
import { api } from "../../public/util/api";
import { getCloud } from "mapp_common/utils/cloud";

export const modifyGametimes = (times) => {
    return { type: MODIFY_GAMETIMES, times };
};

export const modifyReviveTimes = (times) => {
    return { type: MODIFY_REVIVE_TIMES, times };
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

export const AddPrize = (prize_id) => {
    return { type: ADD_PRIZE, prize_id };
};

export const favorShop = (userinfo, cb) => {
    console.log("favorshop", userinfo.active_id);
    return (dispatch) => {
        my.tb.favorShop({
            id: userinfo.seller_id || 2605561614,
            success: (result) => {
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
                        dispatch({ type: SET_FAVOR_SHOP });
                        cb && cb();
                    },
                    errCallback: (err) => {
                        console.log(err);
                    },
                });
            },
        });
    };
};

export const joinGame = (userinfo, game_times, cb) => {
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
                dispatch(modifyGametimes(game_times + 1));
                cb && cb();
            },
            errCallback: (err) => {
                console.log(err);
            },
        });
    };
};

export const userRevive = (userinfo, revive_times, cb) => {
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
                dispatch(modifyReviveTimes(revive_times + 1));
                cb && cb();
            },
            errCallback: (err) => {
                console.log(err);
            },
        });
    };
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
                .then((result) => {
                    console.log(JSON.stringify(result));
                    cb && cb(result["alibaba_benefit_draw_response"].prize_id);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        },
        fail(res) {
            cb && cb(11)
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
                    dispatch(AddPrize(prize_id));
                    cb && cb();
                },
                errCallback: (err) => {
                    console.log(err);
                },
            });
        });
    };
};
