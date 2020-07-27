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
import { getCloud } from "mapp_common/utils/cloud";

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
        this.props.changeTitleAction('活动管理');
    }
/**
 * 优惠卷详细信息
 */
    demo = () => {
        console.log('dianjidianjidianji')
        getCloud().topApi.invoke({
            api: 'alibaba.benefit.query',
            data: {
                'ename': '615cd6e30f714cf99442021f77ed198e',
                'app_name': 'promotioncenter-3000000025552964'
            },
        }).then((res) => {

            console.log('deded', res)
        }).catch((err) => {
            console.log('rerere', res)
        });
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
                        hotReducer.title === '热门活动' && <ActivityCard />
                    }
                    {
                        hotReducer.titleType == 'create' && <CreatePage />
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
                    <View onClick={this.demo}>demo</View>

                </View>
            </View>
        );
    }
}

export default HotActivity;
