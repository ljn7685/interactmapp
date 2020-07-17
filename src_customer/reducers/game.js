import {
    MODIFY_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
} from "../constants/game";

import default_avatar from "../assets/images/avatar.png";

const initState = {
    gametimes: 1,
    max_rank_count: 50,
    max_fail_times: 3,
    subtitle: "> 赢百元现金券/华为P40 <",
    preloaded: false,
    arrow_count: 10,
    arrow_score: 10,
    best_score: 0,
    game_duration: 100000,
    game_rule: {
        start_date: "X月Y日",
        end_date: "W月Z日",
        rules: [
            {
                title: "1.在此期间，通过以下方式可获得 游戏机会：",
                desc: `*首次参与活动，游戏机会*1（该游戏机会不会重复享有）
                *关注店铺，游戏机会*1（该游戏机会不会重复享有）
                *每日收藏1款产品，游戏机会*1（每日限获1次）
                *分享1款产品给好友，仅有当好友打开分享链接后，游戏机会*1（机会可叠加，奖励次数到账或有系统延迟，视为正常现象）`,
            },
            {
                title: "2.奖品明细",
                desc: `一等奖：大于12只口红
            二等奖：9-11只口红
            三等奖：7-8只口红
            幸运奖：5-6只口红`,
            },
            {
                title: "3.活动说明",
                desc: `将底部的口红向上滑动即可插入转盘，规定时间内若碰到其他口红则挑战失败。`,
            },
        ],
    },
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
        case SET_PRELOADED:
            return { ...state, preloaded: action.preloaded };
        case SET_BEST_SCORE:
            return { ...state, best_score: action.score };
        default:
            return state;
    }
}
