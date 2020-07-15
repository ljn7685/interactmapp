import {
  MODIFY_GAMETIMES,
  SET_PRELOADED,
  SET_BEST_SCORE,
} from "../constants/game";

export const modifyGametimes = (times) => {
  return { type: MODIFY_GAMETIMES, times };
};

export const setPreloaded = (preloaded) => {
  return { type: SET_PRELOADED, preloaded };
};

export const setBestScore = (score) => {
  return { type: SET_BEST_SCORE, score };
};
