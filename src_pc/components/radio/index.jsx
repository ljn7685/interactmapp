import { View, Text } from '@tarojs/components';
import React from 'react';
import './index.scss';

export default (props) => {
    const { disabled = false, checked, text, onClick } = props;
    const handleClick = () => {
        if(!disabled) {
            onClick && onClick();
        }
    };
    return (
        <View onClick={() => handleClick()} className={`ad--radio ${checked ? 'ad--checked' : 'ad--unchecked'} ${disabled ? 'ad--disabled' : ''}`}>
            <View className='ad--box'><Text className='ad--on'></Text></View>
            <Text className='ad--text'>{text}</Text>
        </View>
    );
};
