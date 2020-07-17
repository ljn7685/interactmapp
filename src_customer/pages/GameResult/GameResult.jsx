import React, { Component } from "react";

import Modal from "../../components/Modal/Modal";
import styles from "./GameResult.module.scss";
import { Text, View } from "@tarojs/components";
class GameResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { isSuccess, onRestart, restart_times } = this.props;
        let headerStyle =
            styles["header"] +
            " " +
            (isSuccess ? styles["win-header"] : styles["lose-header"]);

        return (
            <Modal
                visible={true}
                headerStyle={headerStyle}
                contentStyle={styles["content"]}
                containerStyle={styles["container"]}
            >
                {isSuccess ? (
                    <Text className={styles["success-tip"]}>恭喜你!</Text>
                ) : restart_times > 0 ? (
                    <Text className={styles["fail-tip"]}>
                        {`啊哦～差一点点就过关咯! 

                        动动手指，再战一次呗～～`}
                    </Text>
                ) : (
                    <Text className={styles["fail-tip"]}>
                        {`啊哦～差一点点就过关咯! 

                        多加练习，再来挑战～～`}
                    </Text>
                )}
                {isSuccess && (
                    <Text className={styles["prize-desc"]}>
                        获得<Text className={styles["prize-num"]}>50</Text>
                        元优惠券
                    </Text>
                )}
                {isSuccess ? (
                    <View className={styles["use-button"]}>
                        <Text className={styles["text"]}>立即兑换</Text>
                    </View>
                ) : restart_times > 0 ? (
                    <View className={styles["use-button"]} onClick={onRestart}>
                        <Text className={styles["text"]}>再战一次</Text>
                    </View>
                ) : (
                    <View className={styles["use-button"]}>
                        <Text
                            className={styles["text"]}
                            onClick={() => {
                                my.exit();
                            }}
                        >
                            退出游戏
                        </Text>
                    </View>
                )}
            </Modal>
        );
    }
}

export default GameResult;
