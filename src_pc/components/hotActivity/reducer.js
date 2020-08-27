import moment from "moment";
import { isEmpty } from '../utils/index';
import { getUserInfo } from '../../public/util/userInfoChanger';
import { TITLE, SET_VALUE, SET_CONFIG, INIT_ACTIVITY_DATA } from './actions';
import { levelConfig } from "./createPage";

export const version = '0.0.12';
const defaultState = {
    title: '热门活动', // 顶部显示的标题
    titleType: 'hotActivity#activity', // 是否显示数据页面
    activityID: '', // 数据页面需要的活动id和修改的时候需要的id
    operType: '', // 是修改该是复制活动
    activityUrl: '', // 活动的链接，主要是创建成功的页面需要
    activityData:{}, // 修改活动配置的时候，需要拿到的配置数据
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case TITLE: {
            return { ...state, ...action };
        }
        case SET_VALUE: {
            let activityData = Object.assign({}, state.activityData);
            activityData[action.typeItem] = action.value;
            return { ...state, activityData };
        }
        case SET_CONFIG: {
            let gameConfig = Object.assign({}, state.activityData.gameConfig);
            gameConfig[action.key] = action.value;
            return { ...state, activityData:{ ...state.activityData, gameConfig:gameConfig } };
        }
        case INIT_ACTIVITY_DATA: {
            return {
                ...state, activityData:{
                    'activeName': '',
                    'subTitle': '',
                    'startDate': moment().format("YYYY-MM-DD HH:mm:ss"),
                    'endDate': moment().add(7, 'days').format("YYYY-MM-DD HH:mm:ss"),
                    'couponData': '',
                    'activeUrl': `https://m.duanqu.com?_ariver_appid=3000000012505562&nbsv=${isEmpty(getUserInfo().cVersion) ? '0.0.14' : getUserInfo().cVersion}&_mp_code=tb&query=activeID%3D`,
                    'activeRewards': '',
                    'gameConfig':{
                        'maxShareNum':3,
                        'maxCollectNum':3,
                        'goods':[],
                        'gameLevel':levelConfig['2'],
                    },
                },
            };
        }
        default:
            return state;
    }
};