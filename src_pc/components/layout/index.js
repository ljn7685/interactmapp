import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { changeTitleAction } from '../hotActivity/actions';
import { connect } from 'react-redux';
import { contactCustomerService } from '../../../public/util/openChat';

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    /**
     * 联系客服
     */
    connectKeFU = () => {
        contactCustomerService()
    }
    render() {
        const { titleType, changeTitleAction } = this.props;
        return (
            <View className='layout-box'>
                <View className='layout-top'>
                    <Image className='logo' src='http://q.aiyongbao.com/interact/LOGO.png' alt='logo' />
                    <View className='layout-title'>爱用互动</View>
                    <View className='layout-desc'>由 爱用科技 提供</View>
                </View>
                {/* 当用户没有数据的时候，点击去“创建数据”，跳转hotActivity的页面，导航栏颜色要变 */}
                <View className={`layout-item ${titleType.split('#')[0] == 'hotActivity' ? 'action' : ''}`} onClick={changeTitleAction.bind(this, '热门活动', 'hotActivity#activity')}>热门活动</View>
                <View className={`layout-item ${titleType.split('#')[0] == 'management' ? 'action' : ''}`} onClick={changeTitleAction.bind(this, '活动管理', 'management#allActivity')}>活动管理</View>
                <View className='layout-bottom' onClick={this.connectKeFU}>
                    <View className='icno-kefu iconfont'>&#xe65b;</View>
                    <View className='contact'>联系客服</View>
                </View>
            </View>
        );
    }
}
//将store里面的值映射为props
const mapStateToProps = ({ hotReducer }) => {
    return {
        titleType: hotReducer.titleType,
    }
}
const mapDispatchToProps = {
    changeTitleAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
