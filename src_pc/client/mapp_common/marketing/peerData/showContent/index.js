import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';
import { ENV } from "@/constants/env";
import {goToBuy, showBeacon} from '../config';

/**
 * 618活动内容组件
 */
class ShowContent extends Component {
    constructor(props) {
        super(props);
        this.app = ENV.app;
    }
    onClickUse =(value)=> {
        if(!value){
            goToBuy();
            showBeacon('click');
        }
    }
    render() {
        const { used, src, content, title } = this.props;
        return (
            <View className='show-content'>
                <Image className='icno' src={src}></Image>
                <View className={`middle ${this.app == 'item' ? 'midd' : ''}`}>
                    <View className={`${used ? 'mid-titled' : 'mid-title'}`}>{title}</View>
                    <View className={`${used ? 'mid-contented' : 'mid-content '}`}>{content}</View>
                </View>
                <View className={`${used ? 'opertioned' : 'opertion'}`} style={{ display: this.app == 'item' ? 'inline-block' : 'none' }} onClick={this.onClickUse.bind(this,used)}>{used ? '已创建' : '未使用'}</View>
            </View>
        );
    }
}

export default ShowContent;