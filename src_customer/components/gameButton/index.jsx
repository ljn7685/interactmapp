import React from 'react';
import { View } from '@tarojs/components';
import "./index.scss";

const GameButton = (props) => {
    const { className, ...otherProps } = props;
    return (<View {...otherProps} className={`interact-game-button ${className}`}>
        
    </View>);
};
 
export default GameButton;