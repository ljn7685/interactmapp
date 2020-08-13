import React, { Component } from 'react';
import { View } from '@tarojs/components';
import moment from 'moment';
import './index.scss';
import { changeTitleAction, getActivityByIdAction } from '../actions';
import Taro from '@tarojs/taro';
import { isEmpty } from '../../utils/index';
import { connect } from 'react-redux';
import TurnPage from '../../turnPage/index';
import SelectBox from '../../selectBox/index';
import { getActivityDataApi, createActivityApi } from '../../../public/bPromiseApi/index';
import SearchBox from '../../searchBox';

const status_config = {
    "1":"进行中",
    "2":"已结束",
    "3":"未开始",
};
class AllActivity extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isShow: false,
            dataList: '',
        };
        this.pageNo = 1; // 初始页数
        this.pageSize = 10; // 页面条数
        this.activeStatus = ''; // 活动状态
        this.query = '';
    }

    componentDidMount () {
        // 初始化信息
        this.getActivityData();
    }
    /**
     * 获取用户创建的游戏
     */
    getActivityData = async () => {
        const { query } = this;
        const args = { 'pageNo': this.pageNo, 'pageSize': this.pageSize, 'activeStatus': this.activeStatus };
        if(query) {
            args.query = query;
        }
        let data = await getActivityDataApi(args).catch(err => {
            console.log('activity err', err);
        });
        console.log('activity data', data);
        if (this.pageNo > 1 && isEmpty(data)) {
            Taro.showToast({
                title: '已经是最后一页了',
                duration: 2000,
            });
            this.pageNo -= 1;
            return;
        }
        if (!isEmpty(data)) {
            this.setState({
                dataList: data,
                isShow: true,
            });
        } else {
            this.setState({ isShow: false });
        }
    }
    /**
     * 活动数据页面
     * @param {*} id 
     * @param {*} name 
     */
    goToDataPage = (name, activityID) => {
        let title = name + '-活动效果';
        this.props.changeTitleAction(title, 'management#data', activityID);

    }
    /**
     * 点击导航的热门活动
     * @param {*} 
     */
    goToCreatePage = () => {
        this.props.changeTitleAction('热门活动', 'hotActivity#activity');
    }
    /**
     * 点击修改、复制活动
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
        this.activeStatus = value;
        this.pageNo = 1;
        this.getActivityData();
    }
    /**
     * 翻页
     * @param {*} type 
     */
    turnPage = (current) => {
        this.pageNo = current;
        this.getActivityData();
    }
    /**
     * 复制链接
     * @param {*} value 
     */
    copyUrl = (value, id) => {
        Taro.setClipboardData({
            data: value + id,
            success: () => {
                Taro.showToast({
                    title: '复制成功',
                    duration: 2000,
                });
            },
        });
    }
    /**
     * 结束游戏
     * @param {*} id 
     */
    endActivity = async (id, index) => {
        let newData = Object.assign([], this.state.dataList);
        let data = await createActivityApi({ 'activeID': id, 'operationType': 3 });
        if (data.code === 200) {
            newData[index].active_status = 2;
            newData[index].status = '已结束';
            this.setState({ dataList: newData });
        }
    }
    /**
     * 数据具体展现组件
     */
    contentTip = () => {
        const { dataList } = this.state;
        return (
            <View>
                {
                    dataList.map((item, index) => {
                        if(moment(item.start_date).isBefore(new Date()) && item.active_status === 3) {
                            console.warn('活动自动开始', { ...item });
                            item.active_status = 1;
                        }
                        if(moment(item.end_date).isBefore(new Date()) && item.active_status === 1) {
                            console.warn('活动自动结束', { ...item });
                            item.active_status = 2;
                        }
                        if(item.status === undefined || item.status !== status_config[item.active_status]) {
                            item.status = status_config[item.active_status];
                        }
                        return (
                            <View className='activity-content-box' key={item.id}>
                                <View className='content-name col-name'>{item.active_name}</View>
                                <View className='content-status col-status'>{item.status}</View>
                                <View className='content-time-box col-time'>
                                    <View className='time-start'>起：{item.start_date}</View>
                                    <View className='time-end'>止：{item.end_date.substring(0, 10) + ' 23:59:59'}</View>
                                </View>
                                <View className='content-url col-url' onClick={this.copyUrl.bind(this, item.active_url, item.id)}>复制链接</View>
                                <View className='oper-box col-oper'>
                                    <View className='edit-activity oper-tip' onClick={this.editActivity.bind(this, item.id, '修改')} style={{ display:`${item.active_status === 2 ? 'none' : ''}` }}>修改活动</View>
                                    <View className='copy-activity oper-tip' onClick={this.editActivity.bind(this, item.id, '创建')} style={{ display:`${item.active_status === 2 ? '' : 'none'}` }}>复制活动</View>
                                    <View className='data-activity oper-tip' onClick={this.goToDataPage.bind(this, item.active_name, item.id)} style={{ display:`${item.active_status === 3 ? 'none' : ''}` }}>活动数据</View>
                                    <View className='end-activity oper-tip' onClick={this.endActivity.bind(this, item.id, index)} style={{ display:`${item.active_status === 2 ? 'none' : ''}` }}>结束活动</View>
                                </View>
                            </View>
                        );
                    })
                }
                {
                    <TurnPage onPageNoChange={this.turnPage} pageNo={this.pageNo} />
                }
            </View>
        );
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
        );
    }
    onClickSearch = (query) => {
        console.log('onClickSearch');
        this.pageNo = 1;
        this.query = query;
        this.getActivityData();
    }

    render () {
        const { isShow } = this.state;
        return (
            <View className='all-box'>
                <View className='all-top'>
                    <SelectBox changeStatu={this.selectStatu} />
                    <SearchBox
                        className='search-box'
                        placeholder='请输入活动名称搜索'
                        onSearch={this.onClickSearch}
                    />
                </View>
                {
                    !isShow && this.emptyPage()
                }
                {
                    isShow && <View className='all-activity-content'>
                        <View className='all-activity-title'>
                            <View className='activity-name col-name'>活动名称</View>
                            <View className='activity-status col-status'>活动状态</View>
                            <View className='activity-time col-time'>活动时间</View>
                            <View className='activity-url col-url'>活动链接</View>
                            <View className='activity-oper col-oper'>操作</View>
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

// 将store里面的值映射为props
const mapDispatchToProps = {
    changeTitleAction,
    getActivityByIdAction,
};
export default connect(state => state.hotReducer, mapDispatchToProps)(AllActivity);
