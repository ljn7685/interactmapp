import React, { Component } from "react";
import { connect } from "react-redux";

import Modal from "../../components/Modal/Modal";
import styles from "./GameResult.module.scss";
import { Text, View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import close_btn_img from "../../assets/images/close_btn.png";
import { drawPrize } from "../../actions/game";

@connect(({ game }) => {
    return {
        appid: game.appid,
        userinfo: game.userinfo,
    };
},{
    drawPrize
})
class GameResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    onClickClose = () => {
        Taro.redirectTo({
            url: "/pages/GameIndex/GameIndex",
        });
    };
    exchangePrize = () => {
        console.log('exchangePrize')
        const { appid, userinfo } = this.props;
        this.props.drawPrize(userinfo, appid,()=>{
            Taro.redirectTo({
                url: "/pages/GameIndex/GameIndex?successfully_received=true",
            });
        })
    };
    render() {
        const { isSuccess, onRestart, revive_times } = this.props;
        console.log("reveie times", revive_times);
        let headerStyle =
            styles["header"] +
            " " +
            (isSuccess ? styles["win-header"] : styles["lose-header"]);
        const footer = !isSuccess && revive_times > 0 && (
            <Image
                src={close_btn_img}
                mode="widthFix"
                className={styles["footer"]}
                onClick={this.onClickClose}
            ></Image>
        );
        return (
            <Modal
                visible={true}
                footer={footer}
                headerStyle={headerStyle}
                contentStyle={styles["content"]}
                containerStyle={styles["container"]}
            >
                {isSuccess ? (
                    <Text className={styles["success-tip"]}>恭喜你!</Text>
                ) : revive_times > 0 ? (
                    <Text
                        className={styles["fail-tip"]}
                        style={{ marginTop: "28px" }}
                    >
                        {`天呐！运气爆棚！
                        
                        获得一次复活机会
                        
                        关闭视为放弃复活机会哦～`}
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
                        <Text
                            className={styles["text"]}
                            onClick={this.exchangePrize}
                        >
                            立即兑换
                        </Text>
                    </View>
                ) : revive_times > 0 ? (
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
