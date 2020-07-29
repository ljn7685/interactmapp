import React, { Component } from 'react';
import {View} from '@tarojs/components';
import './index.scss';
import ActivityCard from './activityCard/index';
import CreatePage from './createPage/index';
import ActivitySuccess from './activitySuccess/index';
import AllActivity from './allActivity/index';
import ActivityData from './activityData/index';
import { connect } from 'react-redux';
import { changeTitleAction } from './actions';

@connect(({ hotReducer }) => ({
    hotReducer
}), (dispatch) => ({
    changeTitleAction(title, titleType) {
        dispatch(changeTitleAction(title, titleType))
    }
}))

class HotActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    backToAllActivity = () => {
        this.props.changeTitleAction('活动管理', 'management');
    }

    render() {

        const { hotReducer } = this.props;
        return (
            <View className='content-box'>
                <View className='sesecond-title'>
                    {
                        hotReducer.titleType == 'data' && <View className='back-icno iconfont' onClick={this.backToAllActivity} >&#xe669;</View>
                    }
                    {hotReducer.title}
                </View>
                <View className='content'>
                    {
                        hotReducer.titleType === 'hotActivity' && <ActivityCard />
                    }
                    {
                        hotReducer.titleType == 'create' && <CreatePage />
                    }
                    {
                        hotReducer.titleType === 'success' && <ActivitySuccess />
                    }
                    {
                        hotReducer.titleType === 'management' && <AllActivity />
                    }
                    {
                        hotReducer.titleType == 'data' && <ActivityData />
                    }

                </View>
            </View>
        );
    }
}

export default HotActivity;
