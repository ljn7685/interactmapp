import React, { Component } from 'react';
import { Text, View, Button, Image } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { changeTitleAction } from '../hotActivity/actions';
import { connect } from 'react-redux';
import { getUserInfo } from '../../../public/util/userInfoChanger';
import {api} from '../../public/util/api';
import {contactCustomerService} from '../../../public/util/openChat';

@connect(({hotReducer})=>({
    hotReducer
}), (dispatch) => ({
    changeTitleAction (title, titleType) {
      dispatch(changeTitleAction(title, titleType))
    }
  }))

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: 'hotActivity'
        }
    }
    /**
     * 侧边栏点击不同按钮
     * @param {*} values 
     */
    goToHotPage =(values)=>{
        //顶部的title
        let data = '热门活动';
        if(values == 'management'){
            data = '活动管理';
        }
        this.props.changeTitleAction(data, values);
        this.setState({
            isShow: values
        })
    }
    /**
     * 联系客服
     */
    connectKeFU = ()=>{
        contactCustomerService()
    }
    render() {
        const { isShow } = this.state;
        const { hotReducer } = this.props;
        return (
            <View className='layout-box'>
                <View className='layout-top'>
                    <Image className='logo' src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594993792793&di=b6603d7e773657969831b7c412616b28&imgtype=0&src=http%3A%2F%2Fa1.att.hudong.com%2F05%2F00%2F01300000194285122188000535877.jpg' alt='logo' />
                    <View className='layout-title'>疯狂飞镖</View>
                    <View className='layout-desc'>由 爱用科技 提供</View>
                </View>
                {/* 当用户没有数据的时候，点击去“创建数据”，跳转hotActivity的页面，导航栏颜色要变 */}
                <View className={`layout-item ${isShow == 'hotActivity' || hotReducer.titleType == 'hotActivity' ? 'action' : ''}`} onClick={this.goToHotPage.bind(this,'hotActivity')}>热门活动</View>
                <View className={`layout-item ${isShow == 'management' && hotReducer.titleType != 'hotActivity' ? 'action' : ''}`} onClick={this.goToHotPage.bind(this,'management')}>活动管理</View>
                <View className='layout-bottom' onClick={this.connectKeFU}>
                    <View className='icno-kefu iconfont'>&#xe65b;</View>
                    <View className='contact'>联系客服</View>
                </View>
            </View>
        );
    }
}

export default Layout;
