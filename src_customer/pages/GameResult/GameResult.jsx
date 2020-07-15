import React, { Component } from "react";

import { connect } from "react-redux";

import Modal from "../../components/Modal/Modal";
import styles from "./GameResult.module.scss";
import exchange_icon from "../../assets/images/exchange.png";
import playagain_icon from "../../assets/images/playagain.png";
import { Text, Image, View } from "@tarojs/components";
class GameResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {
            isSuccess,
            gametimes,
            onRestart,
            score,
            arrow_count,
            arrow_score,
            best_score,
        } = this.props;
        let headerStyle =
            styles["header"] +
            " " +
            (isSuccess ? styles["win-header"] : styles["lose-header"]);
        let footer = (
            <View className={styles["footer"]}>
                <View className={styles["footer-desc"]}>
                    <Text>当前剩余游戏次数</Text>
                    <Text>{gametimes}</Text>
                </View>
                <View className={styles["footer-button-group"]}>
                    <View className={styles["footer-button"]}>
                        获取游戏次数
                    </View>
                    <View
                        className={styles["footer-button"]}
                        onClick={onRestart}
                    >
                        再战一次
                    </View>
                </View>
            </View>
        );

        return (
            <Modal
                visible={true}
                footer={footer}
                headerStyle={headerStyle}
                contentStyle={styles["content"]}
                containerStyle={styles["container"]}
            >
                <Text className={styles["user-score"]}>
                    您的成绩为<span className={styles["score"]}>{score}分</span>
                </Text>
                <Text className={styles["user-beat"]}>
                    {isSuccess
                        ? "成功击败全国90%的玩家"
                        : `成绩要达到${arrow_count * arrow_score}分才算成功哦`}
                </Text>
                <View className={styles["best-record"]}>
                    <View className={styles["item"]}>
                        <View className={styles["desc"]}>最佳成绩</View>
                        <View className={styles["value"]}>{best_score}分</View>
                    </View>
                    <View className={styles["line"]}></View>
                    <View className={styles["item"]}>
                        <View className={styles["desc"]}>最佳排名</View>
                        <View className={styles["value"]}>NO.222</View>
                    </View>
                </View>
                <Text className={styles["msg"]}>
                    {isSuccess
                        ? "欧气满满～恭喜你获得 你说是啥就是啥"
                        : "再加把劲，胜利再望～"}
                </Text>
                {isSuccess ? (
                    <View className={styles["use-button"]}>
                        <Text className={styles["text"]}>立即兑换</Text>
                        <Image
                            src={exchange_icon}
                            alt=""
                            className={styles["img"]}
                        />
                    </View>
                ) : (
                    <View className={styles["use-button"]} onClick={onRestart}>
                        <Text className={styles["text"]}>再战一次</Text>
                        <Image
                            src={playagain_icon}
                            alt=""
                            mode="widthFix"
                            className={styles["img"]}
                        />
                    </View>
                )}
            </Modal>
        );
    }
}

const mapStateToProps = ({game}) => {
    return {
        gametimes: game.gametimes,
        arrow_count: game.arrow_count,
        arrow_score: game.arrow_score,
        best_score: game.best_score,
    };
};
const wrapper = connect(mapStateToProps, null)(GameResult);
export default wrapper;
