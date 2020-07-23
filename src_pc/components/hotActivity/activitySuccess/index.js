import React, { Component } from 'react';
import { Text, View, Button, Image } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';


class ActivitySuccess extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    /**
     * 复制活动链接
     */

    copyUrl = (type) => {
        let data;
        switch(type){
            case 'activity':
                data = '链接kdajkfcjksbkhvchsdhjiahz假装这里是链接';
                break;
            case 'img-one':
                data = 'one';
                break;
            case 'img-two':
                data = 'two';
                break;
        }
        Taro.setClipboardData({
            data: data,
            success: function (res) {
            }
        })
    }

    render() {
        return (
            <View className='success-box'>
                <View className='success-top'>
                    <View className='success-icno'>《</View>
                    <View className='success-txt'>恭喜！活动创建成功</View>
                </View>
                <View className='success-content'>
                    <View className='step'>投放活动到手淘端步骤如下</View>
                    <View className='url-box'>
                        <View className='url-txt'>1.复制活动链接</View>
                        <View className='url'>链接kdajkfcjksbkhvchsdhjiahz假装这里是链接</View>
                        <View className='url-copy' onClick={this.copyUrl.bind(this,'activity')}>复制链接</View>
                    </View>
                    <View className='poster-box'>
                        <View className='poster-title'>2.推广海报</View>
                        <View className='poster-img-box'>
                            <View className='poster'>
                                <Image className='poster-img' src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595332852038&di=4b789f36a4c1e618db284ec9039d89c3&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F86%2F10%2F01300000184180121920108394217.jpg' alt='poster' />
                                <View className='copy-img' onClick={this.copyUrl.bind(this,'img-one')}>复制图片链接</View>
                            </View>
                            <View className='poster'>
                                <Image className='poster-img' src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595332852038&di=4b789f36a4c1e618db284ec9039d89c3&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F86%2F10%2F01300000184180121920108394217.jpg' alt='poster' />
                                <View className='copy-img' onClick={this.copyUrl.bind(this,'img-two')}>复制图片链接</View>
                            </View>
                        </View>
                    </View>
                    <View className='fitment'>
                        <View className='fitment-txt'>3.进入店铺装修&gt;选择图文模块&gt;填入链接</View>
                        <View className='fitment-btu'>去装修</View>
                    </View>
                </View>
            </View>
        );
    }
}

export default ActivitySuccess;
