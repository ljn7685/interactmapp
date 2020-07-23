import React, { Component } from 'react';
import { Text, View, Button } from '@tarojs/components';
import './index.scss';
import { changeTitleAction, getActivityByIdAction } from '../actions';

import { connect } from 'react-redux';

@connect(({ hotReducer }) => ({
    hotReducer
}), (dispatch) => ({
    changeTitleAction(title, titleType) {
        dispatch(changeTitleAction(title, titleType))
    },
    getActivityByIdAction(id){
        dispatch(getActivityByIdAction(id))
    }
}))

class AllActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }
/**
 * 活动数据页面
 * @param {*} id 
 * @param {*} name 
 */
    goToDataPage = (id, name) => {
        let title = name + '-活动效果'
        this.props.changeTitleAction(title, 'data');
    }
    goToCreatePage =(id)=>{
        this.props.changeTitleAction('热门活动');
    }
    edit = (id)=>{
        this.props.getActivityByIdAction(id);
        this.props.changeTitleAction('创建丘比特之箭活动');
    }

    contentTip = () => {
        const demo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        return (
            <View>
                {
                    demo.map((item) => {
                        return (
                            <View className='activity-content-box'>
                                <View className='content-name'>巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉</View>
                                <View className='content-status'>进行中</View>
                                <View className='content-time-box'>
                                    <View className='time-start'>起：2020/05/01 00:00:15</View>
                                    <View className='time-end'>止：2020/08/11 00:23:23</View>
                                </View>
                                <View className='content-url'>复制链接</View>
                                <View className='oper-box'>
                                    <View className='edit-activity oper-tip' onClick={this.edit.bind(this, 'id')}>修改活动</View>
                                    <View className='copy-activity oper-tip'>复制活动</View>
                                    <View className='data-activity oper-tip' onClick={this.goToDataPage.bind(this, 'id', '巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉')}>活动数据</View>
                                    <View className='end-activity oper-tip'>结束活动</View>
                                </View>
                            </View>
                        )
                    })
                }
                <View className='all-activity-bottom'>
                    <View className='pre-page end-page'>上一页</View>
                    <View className='next-page'>下一页</View>
                </View>
            </View>
        )
    }

    emptyPage = () => {
        return (
            <View className='empty-Page'>
                <View className='empty-txt'>暂无活动，立即</View>
                <View className='empty-go' onClick={this.goToCreatePage}>新建活动</View>
                <View className='empty-txt'>吧～</View>
            </View>
        )
    }
    demo =()=>{
        this.setState({
            isShow: !this.state.isShow
        })
    }

    render() {
        const { isShow } = this.state;
        return (
            <View className='all-box'>
                    <View className='all-top'>
                        <View className='choice' onClick={this.demo}></View>
                    </View>
                    {
                        !isShow && this.emptyPage()
                    }
                    {
                        isShow && <View className='all-activity-content'>
                            <View className='all-activity-title'>
                                <View className='activity-name'>活动名称</View>
                                <View className='activity-status'>活动状态</View>
                                <View className='activity-time'>活动时间</View>
                                <View className='activity-url'>活动链接</View>
                                <View className='activity-oper'>操作</View>
                            </View>
                            <View className='activity-content'>
                                {
                                    this.contentTip()
                                }
                            </View>
                        </View>
                    }
            </View>
        );
    }
}

export default AllActivity;
