import {
    MODIFY_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
    SET_ACTIVITY_ENDED,
    MODIFY_REVIVE_TIMES,
    SET_USER_INFO,
    SET_FAVOR_SHOP,
} from "../constants/game";
import { storage } from "mapp_common/utils/storage";
import default_avatar from "../assets/images/avatar.png";

const initState = {
    gametimes: 10,
    max_rank_count: 50,
    max_fail_times: 0,
    revive_times: 0,
    subtitle: "> 赢百元现金券/华为P40 <",
    preloaded: false,
    arrow_count: 10,
    arrow_score: 10,
    best_score: 0,
    game_duration: 60000,
    activity_ended: false,
    is_follow: false,
    userinfo: null,
    game_rule: {
        start_date: "2020-01-01 00:00:00",
        end_date: "2020-12-31 00:00:00",
        rules: [
            {
                title: "一.活动介绍：",
                desc: `1.从店铺首页或商品详情页进入丘比特之箭页面即可开始游戏；
                2.活动期间，可通过关注店铺获取游戏次数；
                3.游戏成功，即可获得奖励；`,
            },
            {
                title: "二.玩法介绍：",
                desc: `1.向后拉动弓箭，手指离开屏幕弓箭射出，若弓箭触碰到转盘中的其他弓箭则挑战失败；
                2.规定时间内弓箭未使用完毕，则挑战失败；`,
            },
            {
                title: "三.奖励规则：",
                desc: `1.优惠券可在卡券包中查看，店铺内购买商品时可使用；
                2.每人每日只可领取一个奖励；`,
            },
        ],
    },
    prizes: [
        {
            amount: 50,
            desc: `50元优惠券
            满499元可用`,
        },
        {
            amount: 100,
            desc: `100元优惠券
            满1000元可用`,
        },
    ],
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
        case MODIFY_GAMETIMES:
            return { ...state, gametimes: action.times };
        case MODIFY_REVIVE_TIMES:
            return { ...state, revive_times: action.times };
        case SET_PRELOADED:
            return { ...state, preloaded: action.preloaded };
        case SET_BEST_SCORE:
            return { ...state, best_score: action.score };
        case SET_ACTIVITY_ENDED:
            return { ...state, activity_ended: action.isEnded };
        case SET_USER_INFO:
            const {userinfo} = action;
            const {game_rule} = state;
            game_rule.start_date = userinfo.start_date;
            game_rule.end_date = userinfo.end_date;
            const active_id = Number(storage.getItemSync('active_id'))
            userinfo.active_id = active_id;
            return {
                ...state,
                is_follow: Boolean(action.userinfo.is_follow),
                max_fail_times: userinfo.game_number,
                subtitle: userinfo.sub_title,
                game_rule,
                userinfo,
            };
        case SET_FAVOR_SHOP:
            state.userinfo.is_follow = 1;
            return { ...state, is_follow: true };
        default:
            return state;
    }
}
