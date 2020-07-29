import React, { Component } from 'react';
import { Text, View, Button } from '@tarojs/components';
import './index.scss';
import { changeTitleAction, getActivityByIdAction } from '../actions';
import { api } from '../../../public/util/api';
import Taro from '@tarojs/taro';
import { isEmpty } from '../../utils/index';
import { connect } from 'react-redux';

@connect(({ hotReducer }) => ({
    hotReducer
}), (dispatch) => ({
    changeTitleAction(title, titleType, activityID) {
        dispatch(changeTitleAction(title, titleType, activityID))
    },
    getActivityByIdAction(id, operType) {
        dispatch(getActivityByIdAction(id, operType))
    }
}))

class AllActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            isShowSelect: false,
            status: '全部',
            dataList:''
        }
        this.pageNo = 1; //初始页数
        this.pageSize = 10; //页面条数
        this.activeStatus = ''; //活动状态

    }

    componentDidMount(){
        //初始化信息
        this.getActivityData();
    }

    /**
     * 调取二次封装的接口
     */
    getActivityData = async()=>{
        let data = await this.getActivityDataApi({'pageNo': this.pageNo, 'pageSize': this.pageSize, 'activeStatus': this.activeStatus});
        if(this.pageNo > 1 && isEmpty(data)){
            Taro.showToast({
                title: '已经是最后一页了',
                duration: 2000
            })
            this.pageNo -= 1;
            return;
        }
        if(!isEmpty(data)){
            this.setState({
                dataList: data,
                isShow: true
            })
        }
    }
    /**
     * 活动数据页面
     * @param {*} id 
     * @param {*} name 
     */
    goToDataPage = ( name, activityID) => {
        let title = name + '-活动效果';
        this.props.changeTitleAction(title, 'data', activityID);

    }
    /**
     * 点击导航的热门活动
     * @param {*} id 
     */
    goToCreatePage = (id) => {
        this.props.changeTitleAction('热门活动', 'hotActivity');
    }
    /**
     * 点击编辑
     * @param {*} id 
     */
    editActivity = (id, operType) => {
        this.props.getActivityByIdAction(id, operType);
    }

/**
 * 下拉框的样式控制
 * @param {*} value 
 */
    selectStatu = (value) => {
        if (value == 'pullDown') {
            this.setState({
                isShowSelect: !this.state.isShowSelect
            })
        } else {
            this.setState({
                isShowSelect: !this.state.isShowSelect,
                status: value
            })
            switch(value){
                case '进行中':
                    this.activeStatus = 1;
                    break;
                case '已结束':
                    this.activeStatus = 2;
                    break;
                case '未开始':
                    this.activeStatus = 3;
                    break;
                case '全部':
                    this.activeStatus = '';
                    break;
            }
            this.pageNo = 1;
            this.getActivityData();
        }
    }
    /**
     * 翻页
     * @param {*} type 
     */
    turnPage =(type)=>{
        if(type == 'up'){
            if(this.pageNo == 1){
                Taro.showToast({
                    title: '已经是最前页了',
                    duration: 2000
                })
                return;
            }
            this.pageNo -= 1;
        }else{
            this.pageNo += 1;
        }
        this.getActivityData();
    }
    /**
     * 复制链接
     * @param {*} value 
     */
    copyUrl = (value, id)=>{
        Taro.setClipboardData({
            data: value + id,
            success:()=>{
                Taro.showToast({
                    title: '复制成功',
                    duration: 2000
                })
            }
          })
    }
    /**
     * 结束游戏
     * @param {*} id 
     */
    endActivity=(id, index)=>{
        console.log('dddd',id, index)
        let newData = Object.assign([], this.state.dataList);
        api({
            apiName:'aiyong.interactb.activity.create',
            method:'/interactive/creatInteract',
            args: { 'activeID': id, 'operationType': 3},
            callback:res => {
               newData[index].active_status = 2;
               newData[index].status = '已结束';
               this.setState({
                dataList: newData
               })
            },
            errCallback: err => {
              console.log('dssdddwww',err)
            }
        })
    }
    /**
     * 获取用户的创建游戏数据api
     * @param {*} args 
     */
    getActivityDataApi = (args)=>{
        return new Promise((resolve, reject)=>{
            api({
                apiName:'aiyong.interactb.user.createact.get',
                method:'/interactive/getUserCreateInterActData',
                args: args,
                callback:res => {
                   let data = res.map((item)=>{
                        if(item.active_status == 2){
                            item.status = '已结束';
                        }else if(item.active_status == 1){
                            item.status = '进行中';
                        }else if(item.active_status == 3){
                            item.status = '未开始';
                        }
                        return item;
                   })
                   resolve(data);
                },
                errCallback: err => {
                  reject(res)
                }
            })
        })
    }
/**
 * 数据具体展现组件
 */
    contentTip = () => {
        const { dataList } = this.state;
        return (
            <View>
                {
                    dataList.map((item,index) => {
                        return (
                            <View className='activity-content-box' key={item.id}>
                                <View className='content-name'>{item.active_name}</View>
                        <View className='content-status'>{item.status}</View>
                                <View className='content-time-box'>
                        <View className='time-start'>起：{item.start_date}</View>
                        <View className='time-end'>止：{item.end_date}</View>
                                </View>
                                <View className='content-url' onClick={this.copyUrl.bind(this,item.active_url, item.id)}>复制链接</View>
                                <View className='oper-box'>
                                    <View className='edit-activity oper-tip' onClick={this.editActivity.bind(this, item.id, '修改')} style={{display:`${item.active_status == 2 ? 'none':''}`}}>修改活动</View>
                                    <View className='copy-activity oper-tip' onClick={this.editActivity.bind(this, item.id, '创建')} style={{display:`${item.active_status == 2 ? '':'none'}`}}>复制活动</View>
                                    <View className='data-activity oper-tip' onClick={this.goToDataPage.bind(this, item.active_name, item.id)} style={{display:`${item.active_status == 3 ? 'none':''}`}}>活动数据</View>
                                    <View className='end-activity oper-tip' onClick={this.endActivity.bind(this, item.id, index)} style={{display:`${item.active_status == 2 ? 'none':''}`}}>结束活动</View>
                                </View>
                            </View>
                        )
                    })
                }
                <View className='all-activity-bottom'>
                    <View className='pre-page' onClick={this.turnPage.bind(this,'up')}>上一页</View>
                    <View className='next-page' onClick={this.turnPage.bind(this,'down')}>下一页</View>
                </View>
            </View>
        )
    }
    /**
     * 空页面
     */
    emptyPage = () => {
        return (
            <View className='empty-Page'>
                <View className='empty-txt'>暂无活动，立即</View>
                <View className='empty-go' onClick={this.goToCreatePage}>新建活动</View>
                <View className='empty-txt'>吧～</View>
            </View>
        )
    }

    /**
     * 下拉框选择
     */
    selectBox = () => {
        const { isShowSelect, status } = this.state;
        return (
            <View className='select-box'>
                <View className='selected' onClick={this.selectStatu.bind(this, 'pullDown')}>
                    <View className='select-txt'>{status}</View>
                    <View className='select-icno iconfont'>&#xe642;</View>
                </View>

                <View className='select-down-box' className={`select-down-box ${isShowSelect ? 'show-select':'no-border'} `}>
                    <View className='select-item' onClick={this.selectStatu.bind(this, '进行中')}>
                        <View className='sure-icno iconfont' style={{ opacity: `${status == '进行中' ? '1' : '0'}` }}>&#xe613;</View>
                        <View className='item-txt'>进行中</View>
                    </View>
                    <View className='select-item' onClick={this.selectStatu.bind(this, '已结束')}>
                        <View className='sure-icno iconfont' style={{ opacity: `${status == '已结束' ? '1' : '0'}` }}>&#xe613;</View>
                        <View className='item-txt'>已结束</View>
                    </View>
                    <View className='select-item' onClick={this.selectStatu.bind(this, '未开始')}>
                        <View className='sure-icno iconfont' style={{ opacity: `${status == '未开始' ? '1' : '0'}` }}>&#xe613;</View>
                        <View className='item-txt'>未开始</View>
                    </View>
                    <View className='select-item' onClick={this.selectStatu.bind(this, '全部')}>
                        <View className='sure-icno iconfont' style={{ opacity: `${status == '全部' ? '1' : '0'}` }}>&#xe613;</View>
                        <View className='item-txt'>全部</View>
                    </View>
                </View>


            </View>
        )
    }

    render() {
        const { isShow } = this.state;
        return (
            <View className='all-box'>
                <View className='all-top'>
                    {this.selectBox()}
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
