import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import GameModal from "../../components/gameModal/gameModal";
import GameButton from "../../components/gameButton";
import styles from "./index.module.scss";
import { connect } from "react-redux";

@connect(({ game }) => {
    return { userinfo: game.userinfo };
})
class GameShare extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    onClickShare =() => {
        my.showSharePanel({
            fail:() => {
                Taro.showToast({ title:"唤起分享失败" });
            },
        });
    }
    render () {
        const {
            onClose,
            userinfo: { game_config, shared_users },
        } = this.props;
        const share_num = Array.isArray(shared_users) ? shared_users.length : 0;
        const share_total = game_config.maxShareNum;
        return (
            <GameModal
                visible
                containerStyle={styles.container}
                contentStyle={styles.content}
                headerStyle={styles.header}
                showTitle={false}
                onClose={onClose}
            >
                <Text className={styles.title}>
                    邀请<Text className={styles.num}>1</Text>
                    个好友参与游戏,可获得<Text className={styles.num}>1</Text>
                    次游戏机会
                </Text>
                <View className={styles.desc}>
                    <Text className={styles["desc-text"]}>
                        最多可邀请
                        <Text className={styles.num}>{share_total}</Text>
                        {`个好友
                        您已经成功邀请`}
                        <Text className={styles.num}>{share_num}</Text>个好友
                    </Text>
                </View>
                <GameButton className={styles.share} onClick={this.onClickShare}>立即邀请</GameButton>
                <Text className={styles.tip}>成功邀请后，请重进刷新</Text>
            </GameModal>
        );
    }
}

export default GameShare;
