import {
  MODIFY_GAMETIMES,
  SET_ASSET_QUEUE,
  SET_BEST_SCORE,
} from "../constants/game";

export const modifyGametimes = (times) => {
  return { type: MODIFY_GAMETIMES, times };
};

export const setAssetQueue = (asset_queue) => {
  return { type: SET_ASSET_QUEUE, asset_queue };
};

export const setBestScore = (score) => {
  return { type: SET_BEST_SCORE, score };
};
