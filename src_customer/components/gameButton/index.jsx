import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import { throttle } from "underscore";

/**
 * 按钮组件
 * @param {*} props 
 */
function GameButton (props) {
    const { className, onClick, ...otherProps } = props;
    return (
        <View
            {...otherProps}
            className={`interact-game-button ${className}`}
            onClick={throttle(onClick, 1000)}
        />
    );
}

export default GameButton;
