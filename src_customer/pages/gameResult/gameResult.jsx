import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import Modal from "../../components/modal/modal";
import styles from "./gameResult.module.scss";
import { Text, View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { drawPrize } from "../../actions/game";
import { showConfirmModal } from "../../../public/util";
import GameButton from "../../components/gameButton";

const close_btn_img = "http://q.aiyongtech.com/interact/close_btn.png";
const successTip = "恭喜你!";
const reviveTip = `天呐！运气爆棚！

获得一次复活机会

关闭视为放弃复活机会哦～`;
const failTip = `啊哦～差一点点就过关咯! 

多加练习，再来挑战～～`;
const receiveTip = `已经领取过这张优惠券啦～

赶紧去店铺逛逛
`;
@connect(
    ({ game }) => {
        return { userinfo: game.userinfo, gametimes:game.gametimes };
    },
    { drawPrize }
)
class GameResult extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    onClickClose = () => {
        Taro.redirectTo({ url: "/pages/gameIndex/gameIndex?gameover=true" });
    };
    exchangePrize = () => {
        console.log("exchangePrize");
        const { userinfo } = this.props;
        this.props.drawPrize(userinfo, () => {
            Taro.redirectTo({
                url:
                    "/pages/gameIndex/gameIndex?successfully_received=true&gameover=true",
            });
        });
    };
    onClickGametimes = () => {
        Taro.redirectTo({ url: "/pages/gameIndex/gameIndex?gameover=true&showTask=true" });
    };
    render () {
        const {
            isSuccess,
            onRestart,
            gametimes,
            userinfo: { active_rewards: { datas } },
        } = this.props;
        let headerStyle = classNames(styles["header"], {
            [styles["win-header"]]: isSuccess,
            [styles["lose-header"]]: !isSuccess,
        });
        const is_receive_rewards = Boolean(this.props.userinfo.is_receive_rewards);
        const footer = !isSuccess && gametimes > 0 && (
            <Image
                src={close_btn_img}
                mode='widthFix'
                className={styles["footer"]}
                onClick={() => {
                    showConfirmModal({
                        title: "",
                        content: `退出后不可再次挑战，确定放弃复活机会吗？`,
                        confirmText: "确定",
                        cancelText: "取消",
                        onConfirm: this.onClickClose,
                    });
                }}
            ></Image>
        );
        const tipStyle = isSuccess ? styles["success-tip"] : styles["fail-tip"];
        const status = isSuccess ? 0 : gametimes > 0 ? 1 : 2;
        const tipText = [is_receive_rewards ? '' : successTip, reviveTip, failTip];
        const onClickBtn = [
            is_receive_rewards ? this.onClickClose : this.exchangePrize,
            onRestart,
            this.onClickGametimes,
        ];
        const btnClass = [
            styles.exchange,
            styles.again,
            classNames(styles.gametimes, styles.big),
        ];
        const btnText = [is_receive_rewards ? "我知道了" : "立即领取", "再战一次", "获取游戏次数"];
        const prizes = datas && datas.length > 0 ? [datas[0]] : [];
        return (
            <Modal
                visible
                footer={footer}
                headerStyle={headerStyle}
                contentStyle={styles["content"]}
                containerStyle={styles["container"]}
            >
                <Text className={tipStyle}>{tipText[status]}</Text>
                {isSuccess && is_receive_rewards && (
                    <Text className={styles["prize-desc"]}>
                        { receiveTip}
                    </Text>
                )}
                {isSuccess && !is_receive_rewards && prizes.length > 0 && (
                    <Text className={styles["prize-desc"]}>
                       获得 <Text key='prizenum' className={styles['prize-num']}>{prizes[0].amount / 100}</Text>元优惠券
                    </Text>
                )}
                {isSuccess && !is_receive_rewards && prizes.length === 0 && (
                    <Text className={styles["prize-desc"]}>
                        获得店铺优惠券
                    </Text>
                )}
                <View className={styles["button-group"]}>
                    {status === 1 && (
                        <GameButton
                            className={styles.gametimes}
                            onClick={this.onClickGametimes}
                        >
                            获取游戏次数
                        </GameButton>
                    )}
                    <GameButton
                        className={btnClass[status]}
                        onClick={onClickBtn[status]}
                    >
                        {btnText[status]}
                    </GameButton>
                </View>
            </Modal>
        );
    }
}

export default GameResult;
