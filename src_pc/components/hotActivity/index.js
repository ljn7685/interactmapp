import React, { Component } from 'react';
import { Text, View, Button, Switch } from '@tarojs/components';
import './index.scss';
import ActivityCard from './activityCard/index';
import { isEmpty } from '../utils/index';
import CreatePage from './createPage/index';
import ActivitySuccess from './activitySuccess/index';
import AllActivity from './allActivity/index';
import ActivityData from './activityData/index';
import { connect } from 'react-redux';
import { changeTitleAction } from './actions';

@connect(({hotReducer})=>({
    hotReducer
}), (dispatch) => ({
    changeTitleAction (title, titleType) {
      dispatch(changeTitleAction(title, titleType))
    }
  }))

class HotActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    componentDidMount() {
        console.log(this.props)
    }
    backToAllActivity = ()=>{
        this.props.changeTitleAction('活动管理');
    }
    

    render() {
        
        const { hotReducer } = this.props;
        return (
            <View className='content-box'>
                <View className='sesecond-title'>
                    {
                         hotReducer.titleType == 'data' && <View className='back-icno' onClick={this.backToAllActivity} >[]</View>
                    }
                    {hotReducer.title}
                </View>
                <View className='content'>
                    {
                        hotReducer.title === '热门活动' && <ActivityCard />
                    }
                    {
                        hotReducer.title === '创建丘比特之箭活动' && <CreatePage />
                    }
                    {
                        hotReducer.title === '活动创建成功' && <ActivitySuccess />
                    }
                    {
                        hotReducer.title === '活动管理' && <AllActivity />
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
