import { TITLE, SET_DATA } from './actions';

const defaultState = {
    title:'热门活动',
    titleType: 'null',
    activityData: []
}

export default (state = defaultState, action) => {
    console.log('action', action)
    switch(action.type){
        case TITLE :{
            let newdata = Object.assign({},state, {title: action.title, titleType: action.titleType});
            return newdata;
        }
        case SET_DATA :{
            let newdata = Object.assign({},state, {activityData: action.data});
            return newdata;
        }
        default: 
            return state

    }
}