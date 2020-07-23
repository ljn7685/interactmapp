import React, { Component } from 'react';
import { Text, View, Button, Image } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { changeTitleAction } from '../hotActivity/actions';
import { connect } from 'react-redux';

@connect(({hotReducer})=>({
    hotReducer
}), (dispatch) => ({
    changeTitleAction (value) {
      dispatch(changeTitleAction(value))
    }
  }))

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: '热门活动'
        }
    }
    goToHotPage =(values)=>{
        this.props.changeTitleAction(values);
        this.setState({
            isShow: values
        })
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
                <View className={`layout-activity ${isShow == '热门活动' || hotReducer.title == '热门活动' ? 'action' : ''}`} onClick={this.goToHotPage.bind(this,'热门活动')}>热门活动</View>
                <View className={`layout-management ${isShow == '活动管理' && hotReducer.title !== '热门活动' ? 'action' : ''}`} onClick={this.goToHotPage.bind(this,'活动管理')}>活动管理</View>
                <View className='layout-bottom'>
                    <View className='icno-kefu'>XX</View>
                    <View className='contact'>联系客服</View>
                </View>
            </View>
        );
    }
}

export default Layout;
