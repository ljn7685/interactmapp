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
            userinfo: {
                game_config,
                is_follow,
                collect_goods = [],
                shared_users = [],
            },
            openCollect,
            openShare,
            onFavorShop,
        } = this.props;
        const taskList = [
            {
                current: is_follow,
                total: 1,
                name: "关注店铺",
                btnText: "立即关注",
                disabledText: "已关注",
                disabled: is_follow === 1,
                onClick: onFavorShop,
            },
        ];
        if (game_config && game_config.gameTask) {
            if (game_config.gameTask.includes("share")) {
                const share_num = Array.isArray(shared_users)  ? shared_users.length : 0;
                const share_total = game_config.maxShareNum;
                taskList.push({
                    current: share_num,
                    total: share_total,
                    name: "邀请好友",
                    btnText: "立即邀请",
                    disabledText: "已完成",
                    disabled: share_num >= share_total,
                    onClick: openShare,
                });
            }
            if (game_config.gameTask.includes("collect")) {
                const collect_num = Array.isArray(collect_goods)  ? collect_goods.length : 0;
                const collect_total = game_config.maxCollectNum;
                taskList.push({
                    current: collect_num,
                    total: collect_total,
                    name: "收藏宝贝",
                    btnText: "去收藏",
                    disabledText: "已完成",
                    disabled: collect_num >= collect_total,
                    onClick: openCollect,
                });
            }
        }
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
