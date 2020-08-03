import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import ActivityCard from './activityCard/index';
import CreatePage from './createPage/index';
import ActivitySuccess from './activitySuccess/index';
import AllActivity from './allActivity/index';
import ActivityData from './activityData/index';
import { connect } from 'react-redux';
import { changeTitleAction } from './actions';

class HotActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    changePage =(values)=>{
        console.log(values)
    }
    render() {
        const { titleType, title, changeTitleAction } = this.props;
        return (
            <View className='content-box'>
                <View className='sesecond-title'>
                    {
                        titleType == 'management#data' && <View className='back-icno iconfont' onClick={changeTitleAction.bind(this, '活动管理', 'management#allActivity')} >&#xe669;</View>
                    }
                    {title}
                </View>
                <View className='content'>
                    {
                        titleType === 'hotActivity#activity' && <ActivityCard />
                    }
                    {
                        titleType == 'hotActivity#create' && <CreatePage />
                    }
                    {
                        titleType === 'hotActivity#success' && <ActivitySuccess />
                    }
                    {
                        titleType === 'management#allActivity' && <AllActivity />
                    }
                    {
                        titleType == 'management#data' && <ActivityData />
                    }            
                </View>
            </View>
        );
    }
}
//将store里面的值映射为props
const mapStateToProps = ({ hotReducer }) => {
    return {
        titleType: hotReducer.titleType,
        title: hotReducer.title
    }
}
const mapDispatchToProps = {
    changeTitleAction
}

export default connect(mapStateToProps, mapDispatchToProps)(HotActivity);
