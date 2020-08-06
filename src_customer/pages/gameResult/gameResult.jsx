import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import Modal from "../../components/modal/modal";
import styles from "./gameResult.module.scss";
import { Text, View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { drawPrize } from "../../actions/game";
import { showConfirmModal } from "../../../public/util";
import { throttle } from "underscore";

const close_btn_img = "http://q.aiyongbao.com/interact/close_btn.png"
const successTip = "恭喜你!";
const reviveTip = `天呐！运气爆棚！

获得一次复活机会

关闭视为放弃复活机会哦～`;
const failTip = `啊哦～差一点点就过关咯! 

多加练习，再来挑战～～`;
@connect(
    ({ game }) => {
        return {
            userinfo: game.userinfo,
        };
    },
    {
        drawPrize,
    }
)
class GameResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    onClickClose = () => {
        Taro.redirectTo({
            url: "/pages/gameIndex/gameIndex?gameover=true",
        });
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
    render() {
        const { isSuccess, onRestart, revive_times } = this.props;
        let headerStyle = classNames(styles["header"], {
            [styles["win-header"]]: isSuccess,
            [styles["lose-header"]]: !isSuccess,
        });
        const footer = !isSuccess && revive_times > 0 && (
            <Image
                src={close_btn_img}
                mode="widthFix"
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
        const status = isSuccess ? 0 : revive_times > 0 ? 1 : 2;
        const tipText = [successTip, reviveTip, failTip];
        const onClickBtn = [
            throttle(this.exchangePrize, 1000),
            onRestart,
            () => my.exit(),
        ];
        const btnText = ["立即领取", "再战一次", "退出游戏"];
        return (
            <Modal
                visible={true}
                footer={footer}
                headerStyle={headerStyle}
                contentStyle={styles["content"]}
                containerStyle={styles["container"]}
            >
                <Text className={tipStyle}>{tipText[status]}</Text>
                {isSuccess && (
                    <Text className={styles["prize-desc"]}>获得店铺优惠券</Text>
                )}
                <View
                    className={styles["use-button"]}
                    onClick={onClickBtn[status]}
                >
                    <Text className={styles["text"]}>{btnText[status]}</Text>
                </View>
            </Modal>
        );
    }
}

export default GameResult;
