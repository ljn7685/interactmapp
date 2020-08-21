import React, { Component } from "react";
import classNames from "classnames";
import GameModal from "../../components/gameModal/gameModal";
import GameButton from "../../components/gameButton";
import styles from "./index.module.scss";
import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";

/**
 * 游戏任务Item
 * @param {*} props
 */
const TaskItem = (props) => {
    const {
        name,
        current,
        total,
        onClick,
        btnText,
        disabledText,
        disabled,
    } = props;
    return (
        <View className={styles["task-item"]}>
            <Text
                className={styles["desc"]}
            >{`${name} ${current}/${total}`}</Text>
            <GameButton
                className={classNames(styles["button"], { [styles["disabled"]]: disabled })}
                onClick={disabled ? () => {} : onClick}
            >
                {disabled ? disabledText : btnText}
            </GameButton>
        </View>
    );
};

@connect(({ game }) => {
    return { userinfo: game.userinfo };
})
class GameTask extends Component {
    constructor (props) {
        super(props);
        this.state = {  };
    }
    render () {
        const {
            onClose,
            taskList,
        } = this.props;
        return (
            <GameModal
                containerStyle={styles.container}
                contentStyle={styles.content}
                title='完成任务获取游戏机会'
                visible
                onClose={onClose}
            >
                {taskList &&
                    taskList.map((item) => (
                        <TaskItem
                            key={item.name}
                            current={item.current}
                            total={item.total}
                            name={item.name}
                            btnText={item.btnText}
                            disabled={item.disabled}
                            disabledText={item.disabledText}
                            onClick={item.onClick}
                        />
                    ))}
            </GameModal>
        );
    }
}

export default GameTask;
