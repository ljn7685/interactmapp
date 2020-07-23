import {
    MODIFY_GAMETIMES,
    SET_PRELOADED,
    SET_BEST_SCORE,
    SET_ACTIVITY_ENDED,
    SET_USER_INFO,
    MODIFY_REVIVE_TIMES,
} from "../constants/game";

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
