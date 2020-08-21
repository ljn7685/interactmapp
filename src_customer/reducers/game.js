import { ADD_GAMETIMES,
    MINUS_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
    SET_ACTIVITY_ENDED,
    SET_USER_INFO,
    SET_FAVOR_SHOP,
    SET_JOIN_GAME,
    SET_RECEIVE_REWARDS, 
    COLLECT_GOOD_ITEM,
    HELP_SHARE_USER } from "../constants/game";

const initState = {
    gametimes: 0,
    preloaded: false,
    arrow_count: 10,
    arrow_score: 10,
    best_score: 0,
    game_duration: 60000,
    activity_ended: false,
    userinfo: { is_follow: 0, sub_title: "" },
    game_rule: {
        start_date: "2020-01-01 00:00:00",
        end_date: "2020-12-31 00:00:00",
    },
};
/**
 * c端reducer
 * @param {*} state 
 * @param {*} action 
 */
export default function reducer (state = initState, action) {
    switch (action.type) {
        case ADD_GAMETIMES:
            return { ...state, gametimes: state.gametimes + 1 };
        case MINUS_GAMETIMES:
            return { ...state, gametimes: state.gametimes - 1 };
        case SET_PRELOADED:
            return { ...state, preloaded: action.preloaded };
        case SET_BEST_SCORE:
            return { ...state, best_score: action.score };
        case SET_ACTIVITY_ENDED:
            return { ...state, activity_ended: action.isEnded };
        case SET_JOIN_GAME:
            return { ...state, userinfo: { ...state.userinfo, is_join: 1 } };
        case SET_FAVOR_SHOP:
            return {
                ...state,
                userinfo: { ...state.userinfo, is_follow: 1, check_favored: 1 },
            };
        case SET_RECEIVE_REWARDS:
            return {
                ...state,
                userinfo: { ...state.userinfo, is_receive_rewards: 1 },
            };
        case SET_USER_INFO: {
            const { userinfo } = action;
            if (typeof userinfo.active_rewards === "string") {
                userinfo.active_rewards = JSON.parse(userinfo.active_rewards);
            }
            if (typeof userinfo.game_config === "string") {
                userinfo.game_config = JSON.parse(userinfo.game_config);
            }
            if (typeof userinfo.collect_goods === 'string') {
                userinfo.collect_goods = userinfo.collect_goods.split(',');
            }
            if (typeof userinfo.shared_users === 'string') {
                userinfo.shared_users = userinfo.shared_users.split(',');
            }
            const game_config = userinfo.game_config;
            const gameTask = game_config && game_config.gameTask;
            const gameLevel = game_config && game_config.gameLevel;
            const rules = [
                {
                    title: "一.活动介绍：",
                    desc: `1.从店铺首页或商品详情页进入丘比特之箭页面即可开始游戏；
                    2.活动期间，可通过关注店铺获得1次游戏机会；${gameTask && gameTask.includes("share") ? `
                    每分享成功1个好友，可获得1次游戏机会，最多邀请${game_config.maxShareNum}个好友；` : ''}${gameTask && gameTask.includes("collect") ? `
                    每收藏成功1个商品，可获得1次游戏机会，最多收藏${game_config.maxCollectNum}个商品；` : ''}`,
                },
                {
                    title: "二.玩法介绍：",
                    desc: `1.向后拉动弓箭，手指离开屏幕弓箭射出，若弓箭触碰到转盘中的其他弓箭则挑战失败；
                    2.规定时间内弓箭未使用完毕，则挑战失败；
                    3.规定时间内所有弓箭都成功射中转盘，则游戏成功可获得奖励；`,
                },
            ];
            userinfo.ename = userinfo.active_rewards.ename;
            // userinfo.is_follow = userinfo.is_join = 0;
            // userinfo.is_played = false;
            return {
                ...state,
                gametimes: userinfo.get_times - userinfo.use_times + (userinfo.is_follow  ? 1 : 0),
                game_rule: {
                    start_date: userinfo.start_date,
                    end_date: userinfo.end_date,
                    rules,
                },
                arrow_count: gameLevel ?  gameLevel.arrow_count : state.arrow_count,
                userinfo,
            };
        }
        case COLLECT_GOOD_ITEM: {
            const { userinfo } = state;
            const collect_goods = Array.isArray(userinfo.collect_goods) ? userinfo.collect_goods.slice() : [];
            collect_goods.push(action.item.num_iid);
            return {
                ...state,
                userinfo:{
                    ...userinfo,
                    collect_goods,
                },
            };
        }
        case HELP_SHARE_USER: {
            const { userinfo } = state;
            return {
                ...state,
                userinfo:{
                    ...userinfo,
                    fromNick:undefined,
                },
            };
        }

        default:
            return state;
    }
}
