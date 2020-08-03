import { TITLE, SET_DATA, SET_URL } from './actions';

const defaultState = {
    title: '热门活动',//顶部显示的标题
    titleType: 'hotActivity#activity',//是否显示数据页面
    activityData: [], //修改活动配置的时候，需要拿到的配置数据
    activityID: '', //数据页面需要的活动id和修改的时候需要的id
    operType: '', //是修改该是复制活动
    activityUrl: '',//活动的链接，主要是创建成功的页面需要
}

export default (state = defaultState, action) => {
    console.log('action', action)
    switch (action.type) {
        case TITLE: {
            return { ...state, ...action};
        }
        default:
            return state;
    }
}