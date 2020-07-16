import {
  MODIFY_GAMETIMES,
  SET_PRELOADED,
  SET_BEST_SCORE,
} from '../constants/game';

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
  user_id: "007",
  rank_list: [
    { id: "001", name: "可爱的**婉莹", avatar: default_avatar, score: 1000 },
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
