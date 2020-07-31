import React, { Component } from "react";
import { connect } from "react-redux";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";
import classNames from "classnames";

import styles from "./gameIndex.module.scss";
import "../../styles/common.scss";
import titleIcon from "../../assets/images/game_title_icon.png";
import start_turntable from "../../assets/images/start_turntable.png";
import start_player from "../../assets/images/start_player.png";
import icon_gift from "../../assets/images/icon_gift.png";
import icon_rule from "../../assets/images/icon_rule.png";

import GameRule from "../gameRule/gameRule";
import ToastBox from "../../components/toast/toast";
import GamePrize from "../gamePrize/gamePrize";
import {
    setActivityEnded,
    setUserInfo,
    favorShop,
    joinGame,
} from "../../actions/game";
class GameIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRotate: true,
            showRule: false,
            showPrize: false,
            jumpIcon: false,
        };
    }
    componentDidMount() {
        let {
            no_enough_times,
            successfully_received,
            gameover,
        } = getCurrentInstance().router.params;
        console.log(getCurrentInstance().router.params);
        if (gameover) {
            this.setState({
                isRotate: false,
            });
        }
        if (no_enough_times) {
            this.showNoEnoughTimes();
        } else if (successfully_received) {
            this.setState({
                jumpIcon: true,
            });
            setTimeout(() => {
                this.setState({
                    jumpIcon: false,
                });
            }, 2500);
            this.toast.info("领取成功", 2000);
        }
    }
    showNoEnoughTimes() {
        this.toast.info("已经参与过该游戏咯～", 2000);
    }
    /**
     * 开始游戏
     */
    onGameStart = () => {
        const { userinfo, joinGame } = this.props;
        if (!userinfo.is_join && !userinfo.played) {
            joinGame(userinfo, () => {
                this.redirectToGame();
            });
        } else {
            this.redirectToGame();
        }
    };
    /**
     * 跳转到游戏页面
     */
    redirectToGame = () => {
        if (this.props.gametimes <= 0) {
            this.showNoEnoughTimes();
        } else {
            Taro.redirectTo({
                url: "/pages/gameScene/gameScene",
            });
        }
    };
    /**
     * 关注店铺
     */
    onFavorShop = () => {
        const { userinfo, gametimes } = this.props;
        this.props.favorShop(userinfo, () => {
            if (userinfo.played) {
                this.toast.info("已经参与过该游戏咯～");
            }
        });
    };
    onClickModal = (name) => {
        this.setState({ [name]: !this.state[name] });
    };
    render() {
        const { showRule, showPrize, jumpIcon } = this.state;
        const { activity_ended, is_follow } = this.props;
        return (
            <View className={styles["bg"]} ref={(ref) => (this.root = ref)}>
                <View className={styles["title"]}>
                    <Image
                        src={titleIcon}
                        alt=""
                        className={styles["title-img"]}
                        mode="widthFix"
                    />
                    <Text className={styles["title-desc"]}>
                        {this.props.subtitle}
                    </Text>
                </View>
                <View className={styles["game-preview"]}>
                    <Image
                        src={start_turntable}
                        alt=""
                        className={`${styles["preview-turntable"]} ${
                            this.state.isRotate ? styles["preview-rotate"] : ""
                        }`}
                        key={start_turntable}
                        mode="widthFix"
                    />
                    <Image
                        src={start_player}
                        alt=""
                        className={
                            styles["preview-content"] + " " + styles["player"]
                        }
                        key={start_player}
                        mode="widthFix"
                    />
                </View>
                <View className={styles["game-info"]}>
                    当前游戏次数: {this.props.gametimes}
                </View>
                <View className={styles["game-button-group"]}>
                    {activity_ended ? (
                        <View
                            className={
                                styles["start-game"] + " " + styles["button"]
                            }
                            onClick={() => {}}
                        >
                            活动已经结束
                        </View>
                    ) : is_follow ? (
                        <View
                            className={
                                styles["start-game"] + " " + styles["button"]
                            }
                            onClick={this.onGameStart}
                        >
                            开始游戏 赢好礼
                        </View>
                    ) : (
                        <View
                            className={
                                styles["start-game"] + " " + styles["button"]
                            }
                            onClick={this.onFavorShop}
                        >
                            关注店铺 获取游戏次数
                        </View>
                    )}
                </View>
                <View className="sidebar">
                    <View
                        className="side-btn"
                        onClick={this.onClickRule}
                        key="rule"
                    >
                        <Image
                            src={icon_rule}
                            alt=""
                            className="side-img"
                            mode="widthFix"
                        ></Image>
                        <Text className="side-btn-desc">游戏规则</Text>
                    </View>
                    <View className={styles["jump-container"]}>
                        <View
                            className={classNames("side-btn", {
                                [styles["jump-icon"]]: jumpIcon,
                            })}
                            onClick={() => {
                                this.onClickModal("showPrize");
                            }}
                            key="prize"
                        >
                            <Image
                                src={icon_gift}
                                alt=""
                                className="side-img"
                                mode="widthFix"
                            ></Image>
                            <Text className="side-btn-desc">我的礼品</Text>
                        </View>
                    </View>
                </View>
                {showRule ? (
                    <GameRule
                        onClose={() => {
                            this.onClickModal("showRule");
                        }}
                    ></GameRule>
                ) : null}
                {showPrize ? (
                    <GamePrize
                        onClose={() => {
                            this.onClickModal("showPrize");
                        }}
                    ></GamePrize>
                ) : null}
                <ToastBox ref={(ref) => (this.toast = ref)}></ToastBox>
            </View>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        gametimes: game.gametimes,
        subtitle: game.subtitle,
        activity_ended: game.activity_ended,
        is_follow: game.is_follow,
        userinfo: game.userinfo,
    };
};
const mapDispatchToProps = {
    setActivityEnded,
    setUserInfo,
    favorShop,
    joinGame,
};
const wrapper = connect(mapStateToProps, mapDispatchToProps)(GameIndex);
export default wrapper;
