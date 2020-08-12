import React, { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';

const posterUrl = {
    'posterOne': 'http://q.aiyongbao.com/interact/poster-one.png',
    'posterTwo': 'http://q.aiyongbao.com/interact/poster-two.png',
};
class ActivitySuccess extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    /**
     * 复制活动链接
     */
    copyUrl = (type) => {
        let data = posterUrl[type];
        if(type === 'activity') {
            data = this.props.activityUrl;
        }
        Taro.setClipboardData({
            data: data,
            success: function () {
                Taro.showToast({
                    title: '复制成功',
                    duration: 2000,
                });
            },
        });
    }
    /**
     * 跳转装修页面
     */
    goToDecoration = () => {
        my.qn.navigateToWebPage({ url: "https://wangpu.taobao.com/wirelessPageList.htm#/shop_index-index/basic?tabId=0" });
    }
    render () {
        return (
            <View className='success-box'>
                <View className='success-top'>
                    <View className='success-icno iconfont'>&#xe600;</View>
                    <View className='success-txt'>恭喜！活动创建成功</View>
                </View>
                <View className='success-content'>
                    <View className='step'>投放活动到手淘端步骤如下</View>
                    <View className='url-box'>
                        <View className='url-txt'>1.复制活动链接</View>
                        <View className='url'>{this.props.activityUrl}</View>
                        <View className='url-copy' onClick={this.copyUrl.bind(this, 'activity')}>复制链接</View>
                    </View>
                    <View className='poster-box'>
                        <View className='poster-title'>2.推广海报</View>
                        <View className='poster-img-box'>
                            <View className='poster'>
                                <Image className='poster-img' src='http://q.aiyongbao.com/interact/poster-one.png' alt='poster' />
                                <View className='copy-img' onClick={this.copyUrl.bind(this, 'posterOne')}>复制图片链接</View>
                            </View>
                            <View className='poster'>
                                <Image className='poster-img' src='http://q.aiyongbao.com/interact/poster-two.png' alt='poster' />
                                <View className='copy-img' onClick={this.copyUrl.bind(this, 'posterTwo')}>复制图片链接</View>
                            </View>
                        </View>
                    </View>
                    <View className='fitment'>
                        <View className='fitment-txt'>3.进入店铺装修&gt;选择图文模块&gt;填入链接</View>
                        <View className='fitment-btu' onClick={this.goToDecoration}>去装修</View>
                    </View>
                </View>
            </View>
        );
    }
}
// 将store里面的值映射为props
const mapStateToProps = ({ hotReducer }) => {
    return { activityUrl: hotReducer.activityUrl };
};

export default connect(mapStateToProps)(ActivitySuccess);
