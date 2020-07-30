import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import { api } from '../../../public/util/api';
import { isEmpty } from '../../utils/index';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';

class ActivityData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false, //是否有数据
            dataList: '',//页面展示每天数据
            dataAll: '' //全部数据
        }
        this.pageNo = 1; //初始页数
        this.pageSize = 10; //页面条数
    }
    componentDidMount() {
        this.getDataByID()
    }
    getDataByID = async () => {
        let data = await this.getDataByIdApi({ 'activeID': this.props.activityID, 'pageNo': this.pageNo, 'pageSize': this.pageSize });
        if (this.pageNo > 1 && isEmpty(data.data)) {
            Taro.showToast({
                title: '已经是最后一页了',
                duration: 2000
            })
            this.pageNo -= 1;
            return;
        }
        if (!isEmpty(data.data)) {
            this.setState({
                isShow: true,
                dataList: data.data,
                dataAll: data.dataAll
            })
        }
    }
    /**
     * 翻页
     * @param {*} type 
     */

    turnPage = (type) => {
        if (type == 'up') {
            if (this.pageNo == 1) {
                Taro.showToast({
                    title: '已经是最前页了',
                    duration: 2000
                })
                return;
            }
            this.pageNo -= 1;
        } else {
            this.pageNo += 1;
        }
        this.getDataByID()
    }
    /**
     * 在封装一层api
     * @param {*} args 
     */
    getDataByIdApi = (args) => {
        return new Promise((resolve, reject) => {
            api({
                apiName: 'aiyong.interactb.activity.data.get',
                method: '/interactive/getInteractData',
                args: args,
                callback: res => {
                    resolve(res)
                },
                errCallback: err => {
                    reject(err)
                }
            })
        })
    }

    /**
     * 数据展现组件
     */
    dataContentTip = () => {
        const { dataList } = this.state;
        return (
            <View>
                {
                    dataList.map((item) => {
                        return (
                            <View className='data-content-tip' key={item.create_date}>
                                <View className='tip-date'>{item.create_date.substring(0, 10)}</View>
                                <View className='tip-num'>{item.num ? item.num : 0}</View>
                                <View className='tip-join'>{item.joinNum ? item.joinNum : 0}</View>
                                <View className='tip-follw'>{item.follow ? item.follow : 0}</View>
                                <View className='tip-reward'>{item.reward ? item.reward : 0}</View>
                            </View>
                        )
                    })
                }
                <View className='data-content-bottom'>
                    <View className='pre-page' onClick={this.turnPage.bind(this, 'up')}>上一页</View>
                    <View className='next-page' onClick={this.turnPage.bind(this, 'down')}>下一页</View>
                </View>

            </View>

        )
    }
    /**
     * 空页面组件
     */
    emptyPageData = () => {
        return (
            <View className='empty-data'>
                <View className='empty-data-icno iconfont'>&#xe687;</View>
                <View className='empty-data-txt'>暂无数据</View>
            </View>
        )
    }

    render() {
        const { isShow, dataAll } = this.state;
        return (
            <View className='activity-data-box'>
                {
                    !isShow && this.emptyPageData()
                }
                {
                    isShow && <View>
                        <View className='data-top'>
                            <View className='data-date'>日期</View>
                            <View className='come'>进入活动页面人数</View>
                            <View className='join'>参与人数</View>
                            <View className='follw'>关注店铺人数</View>
                            <View className='reward'>领取奖励人数</View>
                        </View>
                        <View className='data-content'>
                            {
                                this.pageNo == 1 && <View className='total-box'>
                                    <View className='total-data'>总计</View>
                                    <View className='total-num'>{dataAll.total_num ? dataAll.total_num : 0}</View>
                                    <View className='total-join'>{dataAll.total_join ? dataAll.total_join : 0}</View>
                                    <View className='total-follw'>{dataAll.total_follow ? dataAll.total_follow : 0}</View>
                                    <View className='total-reward'>{dataAll.total_reward ? dataAll.total_reward : 0}</View>
                                </View>
                            }
                            {
                                this.dataContentTip()
                            }
                        </View>
                    </View>
                }

            </View>
        );
    }
}

//将store里面的值映射为props
const mapStateToProps = ({ hotReducer }) => {
    return {
        activityID: hotReducer.activityID,
    }
}

export default connect(mapStateToProps)(ActivityData);