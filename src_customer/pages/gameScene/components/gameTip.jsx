import React, { Component } from "react";
import styles from "./gameTip.module.scss";
import GameModal from "../../../components/gameModal/gameModal";
import { Text, View } from "@tarojs/components";

class GameTip extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        const { onClose } = this.props;
        return (
            <GameModal visible showClose={false} title='游戏规则' contentStyle={styles["content"]}>
                <Text className={styles["rule-desc"]}>{`*向后拉动弓箭，手指离开屏幕弓箭发射；

*规定时间内弓箭全部射中靶上，即可获得奖励；

*倒计时结束或2只弓箭重合，则挑战失败`}</Text>
                <View className={styles["use-button"]} onClick={onClose}>
                    <Text className={styles["text"]}>立即开始</Text>
                </View>
            </GameModal>
        );
    }
}

export default GameTip;
