import {
    ADD_GAMETIMES,
    MINUS_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
    SET_ACTIVITY_ENDED,
    MINUS_REVIVE_TIMES,
    RESET_REVIVE_TIMES,
    SET_USER_INFO,
    SET_FAVOR_SHOP,
    ADD_PRIZE,
    SET_JOIN_GAME,
    SET_REWARDS,
    ADD_PRIZE_TIP,
} from "../constants/game";
const default_avatar = "../../assets/images/avatar.png"

const initState = {
    gametimes: 0,
    max_rank_count: 50,
    max_fail_times: 0,
    revive_times: 0,
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
        rules: [
            {
                title: "一.活动介绍：",
                desc: `1.从店铺首页或商品详情页进入丘比特之箭页面即可开始游戏；
                2.活动期间，可通过关注店铺获取游戏次数；`,
            },
            {
                title: "二.玩法介绍：",
                desc: `1.向后拉动弓箭，手指离开屏幕弓箭射出，若弓箭触碰到转盘中的其他弓箭则挑战失败；
                2.规定时间内弓箭未使用完毕，则挑战失败；
                3.游戏成功，即可获得奖励；`,
            },
        ],
    },
    prizes: [],
    user_id: "007",
    rank_list: [
        {
            id: "001",
            name: "可爱的**婉莹",
            avatar: default_avatar,
            score: 1000,
        },
        { id: "002", name: "可爱的**小小", avatar: default_avatar, score: 950 },
        { id: "003", name: "可爱的**大猫", avatar: default_avatar, score: 930 },
        { id: "004", name: "可爱的**婉莹", avatar: default_avatar, score: 930 },
        { id: "005", name: "可爱的**婉莹", avatar: default_avatar, score: 920 },
        { id: "006", name: "可爱的**婉莹", avatar: default_avatar, score: 918 },
        { id: "007", name: "可爱的**婉莹", avatar: default_avatar, score: 910 },
        { id: "008", name: "可爱的**婉莹", avatar: default_avatar, score: 850 },
        { id: "009", name: "可爱的**婉莹", avatar: default_avatar, score: 810 },
        { id: "010", name: "可爱的**婉莹", avatar: default_avatar, score: 700 },
        { id: "011", name: "可爱的**婉莹", avatar: default_avatar, score: 650 },
    ],
};
export default function reducer(state = initState, action) {
    switch (action.type) {
        case ADD_GAMETIMES:
            return { ...state, gametimes: state.gametimes + 1 };
        case MINUS_GAMETIMES:
            return { ...state, gametimes: state.gametimes - 1 };
        case MINUS_REVIVE_TIMES:
            return { ...state, revive_times: state.revive_times - 1 };
        case RESET_REVIVE_TIMES:
            return { ...state, revive_times: state.max_fail_times };
        case SET_PRELOADED:
            return { ...state, preloaded: action.preloaded };
        case SET_BEST_SCORE:
            return { ...state, best_score: action.score };
        case SET_ACTIVITY_ENDED:
            return { ...state, activity_ended: action.isEnded };
        case SET_JOIN_GAME:
            return { ...state, userinfo: { ...state.userinfo, is_join: 1 } };
        case SET_USER_INFO:
            const { userinfo } = action;
            const { game_rule } = state;
            if (typeof userinfo.active_rewards === "string") {
                userinfo.active_rewards = JSON.parse(userinfo.active_rewards);
            }
            userinfo.ename = userinfo.active_rewards.ename;
            userinfo.played = "fasle" === userinfo.played ? false : true;
            return {
                ...state,
                max_fail_times: userinfo.game_number,
                revive_times: userinfo.game_number,
                game_rule: {
                    ...game_rule,
                    start_date: userinfo.start_date,
                    end_date: userinfo.end_date,
                },
                userinfo,
            };
        case SET_FAVOR_SHOP:
            return {
                ...state,
                userinfo: { ...state.userinfo, is_follow: 1 },
            };
        case SET_REWARDS:
            return {
                ...state,
                userinfo: {
                    ...state.userinfo,
                    active_rewards: {
                        ...state.userinfo.active_rewards,
                        datas: action.rewards,
                    },
                },
            };
        case ADD_PRIZE:
            // const active_rewards = state.userinfo.active_rewards.datas;
            // const newPrize = active_rewards[action.index];
            // const prizes = [...state.prizes, newPrize];
            // return { ...state, prizes };
            return {
                ...state,
                userinfo: { ...state.userinfo, is_receive_rewards: 1 },
            };
        case ADD_PRIZE_TIP:
            const prize_tip = {
                msg: `恭喜你中奖啦！
        请到“我的-红包卡券”中查看奖品！`,
            };
            return { ...state, prizes: prize_tip };
        default:
            return state;
    }
}
