import React, { Component } from "react";
import { connect } from "react-redux";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import classNames from "classnames";

import styles from "./gameIndex.module.scss";
import "../../styles/common.scss";
import GameRule from "../gameRule/gameRule";
import GamePrize from "../gamePrize/gamePrize";
import ToastBox from "../../components/toast/toast";
import { setActivityEnded,
    setUserInfo,
    favorShop,
    joinGame, } from "../../actions/game";
import icon_gift from "../../assets/images/icon_gift.png";
import GameButton from "../../components/gameButton";
import GameTask from "../gameTask";
import CollectGoods from "../collectGoods";
import GameShare from "../gameShare";
import useShareMessage from "../../components/shareMessage";
import HelpShare from "../../components/helpShare";
import HelpShareResult from "../../components/helpShareResult";

const titleIcon = "http://q.aiyongtech.com/interact/game_title_icon.png";
const start_turntable = "http://q.aiyongtech.com/interact/start_turntable.png";
const start_player = "http://q.aiyongtech.com/interact/start_player.png";
const icon_rule = "http://q.aiyongtech.com/interact/icon_rule.png";
class GameIndex extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isRotate: true,
            showRule: false,
            showPrize: false,
            showTask: false,
            showCollect: false,
            showShare: false,
            showHelpShare: false,
            showShareResult: false,
            shareResult: false,
            jumpIcon: false,
        };
    }
    componentDidMount () {
        let {
            successfully_received,
            gameover,
            showTask,
        } = getCurrentInstance().router.params;
        console.log(getCurrentInstance().router.params);
        if (gameover) {
            this.setState({ isRotate: false });
        }
        if (showTask) {
            this.setState({ showTask: true });
        }
        if (successfully_received) {
            this.setState({ jumpIcon: true });
            setTimeout(() => {
                this.setState({ jumpIcon: false });
            }, 2500);
            this.toast.info("领取成功", 2000);
        }
        const query = `activeID=${this.props.userinfo.active_id}&fromNick=${this.props.userinfo.buyerNick}`;
        this.props.setShareInfo({
            title: "丘比特之箭",
            desc: "快来和我一起参与游戏吧！",
            path: `/pages/preload/preload?${query}`,
            imageUrl:
                "https://img.alicdn.com/imgextra/i1/877021141/O1CN01MAQyVz1KIcWr6xHN5_!!877021141.png",
        });
        const { userinfo } = this.props;
        if (userinfo.fromNick) {
            this.setState({ showHelpShare: true });
        }
    }
    /**
     * 开始游戏
     */
    onGameStart = () => {
        const { userinfo, joinGame } = this.props;
        if (!userinfo.is_join) {
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
            Taro.redirectTo({ url: "/pages/gameScene/gameScene" });
        }
    };
    /**
     * 关注店铺
     */
    onFavorShop = () => {
        const { userinfo } = this.props;
        this.props.favorShop(userinfo);
    };
    onToggleModal = (name) => {
        this.setState({ [name]: !this.state[name] });
    };
    onClickBtn = () => {
        const {
            activity_ended,
            userinfo: { check_favored },
        } = this.props;
        !activity_ended && check_favored && this.onGameStart();
        !activity_ended && !check_favored && this.onFavorShop();
    };
    render () {
        const {
            showRule,
            showPrize,
            jumpIcon,
            showTask,
            showCollect,
            showShare,
            showHelpShare,
            showShareResult,
        } = this.state;
        const {
            activity_ended,
            userinfo: { sub_title, fromNick, check_favored },
            gametimes,
        } = this.props;
        return (
            <View className={styles["bg"]} ref={(ref) => (this.root = ref)}>
                <View className={styles["title"]}>
                    <Image
                        src={titleIcon}
                        alt=''
                        className={styles["title-img"]}
                        mode='widthFix'
                    />
                    <Text className={styles["title-desc"]}>{sub_title}</Text>
                </View>
                <View className={styles["game-preview"]}>
                    <Image
                        src={start_turntable}
                        alt=''
                        className={`${styles["preview-turntable"]} ${
                            this.state.isRotate ? styles["preview-rotate"] : ""
                        }`}
                        key={start_turntable}
                        mode='widthFix'
                    />
                    <Image
                        src={start_player}
                        alt=''
                        className={
                            styles["preview-content"] + " " + styles["player"]
                        }
                        key={start_player}
                        mode='widthFix'
                    />
                </View>
                <View className={styles["game-info"]}>
                    当前游戏次数: {gametimes}
                </View>
                <View className={styles["game-button-group"]}>
                    <GameButton
                        className={styles["start-game"]}
                        onClick={this.onClickBtn}
                        disabled={gametimes <= 0 && check_favored && !activity_ended || activity_ended}
                    >
                        {activity_ended
                            ? "活动已经结束"
                            : check_favored
                                ? "开始游戏 赢好礼"
                                : "关注店铺 获取游戏次数"}
                    </GameButton>
                    <GameButton
                        className={styles["game-times"]}
                        onClick={this.onToggleModal.bind(this, "showTask")}
                    >
                        获取更多游戏次数
                    </GameButton>
                </View>
                <Text className={styles["game-desc"]}>
                    连续参与游戏成功率更高哦
                </Text>
                <View className='sidebar'>
                    <View
                        className='side-btn'
                        onClick={this.onToggleModal.bind(this, "showRule")}
                        key='rule'
                    >
                        <Image
                            src={icon_rule}
                            alt=''
                            className='side-img'
                            mode='widthFix'
                        ></Image>
                        <Text className='side-btn-desc'>游戏规则</Text>
                    </View>
                    <View className={styles["jump-container"]}>
                        <View
                            className={classNames("side-btn", { [styles["jump-icon"]]: jumpIcon })}
                            onClick={() => {
                                this.onToggleModal("showPrize");
                            }}
                            key='prize'
                        >
                            <Image
                                src={icon_gift}
                                alt=''
                                className='side-img'
                                mode='widthFix'
                            ></Image>
                            <Text className='side-btn-desc'>我的礼品</Text>
                        </View>
                    </View>
                </View>
                {showRule ? (
                    <GameRule
                        onClose={() => {
                            this.onToggleModal("showRule");
                        }}
                    ></GameRule>
                ) : null}
                {showPrize ? (
                    <GamePrize
                        onClose={() => {
                            this.onToggleModal("showPrize");
                        }}
                    ></GamePrize>
                ) : null}
                {showTask ? (
                    <GameTask
                        onClose={this.onToggleModal.bind(this, "showTask")}
                        openCollect={() => {
                            this.onToggleModal("showTask");
                            this.onToggleModal("showCollect");
                        }}
                        openShare={() => {
                            this.onToggleModal("showTask");
                            this.onToggleModal("showShare");
                        }}
                        onFavorShop={this.onFavorShop}
                    />
                ) : null}
                {showCollect ? (
                    <CollectGoods
                        onClose={this.onToggleModal.bind(this, "showCollect")}
                    />
                ) : null}
                {showShare ? (
                    <GameShare
                        onClose={this.onToggleModal.bind(this, "showShare")}
                    />
                ) : null}
                {showHelpShare ? (
                    <HelpShare
                        onClose={this.onToggleModal.bind(this, "showHelpShare")}
                        fromNick={fromNick}
                        openShareResult={(res) => {
                            this.onToggleModal("showShareResult");
                            this.setState({ shareResult: res });
                        }}
                    />
                ) : null}
                {showShareResult ? (
                    <HelpShareResult
                        onClose={this.onToggleModal.bind(
                            this,
                            "showShareResult"
                        )}
                        isSuccess={this.state.shareResult}
                    />
                ) : null}
                <ToastBox ref={(ref) => (this.toast = ref)}></ToastBox>
            </View>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        gametimes: game.gametimes,
        activity_ended: game.activity_ended,
        userinfo: game.userinfo,
    };
};
const mapDispatchToProps = {
    setActivityEnded,
    setUserInfo,
    favorShop,
    joinGame,
};
const wrapper = useShareMessage(
    connect(mapStateToProps, mapDispatchToProps)(GameIndex)
);
export default wrapper;
