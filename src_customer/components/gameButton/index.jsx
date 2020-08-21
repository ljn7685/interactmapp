import React from "react";
import { View } from "@tarojs/components";
import classNames from 'classnames';
import { throttle } from "underscore";
import "./index.scss";

const empty = () => {};
/**
 * 按钮组件
 * @param {*} props 
 */
function GameButton (props) {
    const { className, onClick, disabled, ...otherProps } = props;
    return (
        <View
            {...otherProps}
            className={classNames('interact-game-button', { [className]:className })}
            style={disabled ? {
                backgroundColor: '#cbcbcb',
                color: '#ffffff',
                pointerEvents: 'none',
            } : {}}
            onClick={disabled ? empty : throttle(onClick, 5000)}
        />
    );
}

export default GameButton;
