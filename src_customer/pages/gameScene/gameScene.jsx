import React, { Component } from "react";
import { connect } from "react-redux";

import { View, Image, Canvas, Text } from "@tarojs/components";
import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";

import Game from "./game";
import { minusGametimes,
    addGameNumberAction,
    setBestScore, } from "../../actions/game";

import styles from "./gameScene.module.scss";
import "../../styles/common.scss";
import GameResult from "../gameResult/gameResult";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Bump from "bump.js";
import GameTip from "./components/gameTip";
import ToastBox from "../../components/toast/toast";
import guide_gif from "../../assets/images/guide.gif";
import start_heart_gif from "../../assets/images/start_heart.gif";
import success_angel_gif from "../../assets/images/success_angel.gif";

const { registerCanvas } = PIXI.miniprogram;

class GameScene extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showGuide: false,
            showHeart: false,
            showSuccessAngel: false,
            showGameResult: false,
            showTip: true,
            isSuccess: false,
            score: 0,
            arrow_count: 0,
            countdown: { value: "00:00", scale: 1 },
            game: new Game(),
        };
    }
    componentDidMount () {
        const { revive } = getCurrentInstance().router.params;
        const { userinfo } = this.props;
        if (this.props.gametimes <= 0 && !revive) {
            Taro.redirectTo({ url: "/pages/gameIndex/gameIndex?no_enough_times=true" });
        } else {
            if (revive) {
                this.setState({ showTip: false });
            }
            this.props.addGameNumberAction(userinfo, () => {
                this.onCanvasReady();
                if (revive) {
                    this.gameStart();
                }
            });
        }
    }
    componentWillUnmount () {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        let { game } = this.state;
        if (game) {
            game.destroy();
        }
    }
    /**
     * onLoad
     */
    onLoad () {
        this.state.game.initAudio();
    }
    /**
     * 游戏开始
     */
    gameStart () {
        console.log("gameStart");
        const { game } = this.state;
        game.gameReady();
        this.changeState("showGuide", true);
        this.timer = setTimeout(() => {
            this.changeState("showGuide", false);
        }, 1150 * 3);
    }
    /**
     * 设置canvas
     */
    onCanvasReady () {
        console.log("onCanvasReady");
        const { game } = this.state;
        game.bump = new Bump(PIXI);
        // 建立canvas引用
        // eslint-disable-next-line no-undef
        my._createCanvas({
            id: "canvas",
            success: (canvas) => {
                // eslint-disable-next-line no-undef
                const systemInfo = my.getSystemInfoSync();
                // 拿到当前设备像素密度
                const dpr = systemInfo.pixelRatio;
                // 拿到当前设备的宽高
                const clientWidth = systemInfo.windowWidth * dpr;
                const clientHeight = systemInfo.windowHeight * dpr;
                // 为canvas设定宽高（需要设备宽高* 像素密度）;
                canvas.width = clientWidth;
                canvas.height = clientHeight;
                this.pixiCanvas = canvas;
                // 为pixi引擎注册当前的canvas
                registerCanvas(canvas);
                // 初始化PIXI.Application
                // 计算application的宽高
                const size = {
                    width: 750,
                    height: (clientHeight / clientWidth) * 750,
                };
                const context = canvas.getContext("2d");
                // canvas.getContext('webgl')
                // eslint-disable-next-line no-unused-vars
                this.application = new PIXI.Application({
                    width: size.width,
                    height: size.height,
                    view: canvas,
                    context: context,
                    transparent: true,
                    // 强制使用2d上下文进行渲染，如果为flase,则默认使用webgl渲染
                    forceCanvas: true,
                    // 设置resolution 为像素密度
                    resolution: clientWidth / 750,
                });
                game.width = size.width;
                game.height = size.height;
                game.on("pointstart", () => {
                    this.changeState("showGuide", false);
                });
                game.on("changeHeart", (visible) => {
                    this.changeState("showHeart", visible);
                });
                game.on("changeSuccessAngel", (visible) => {
                    this.changeState("showSuccessAngel", visible);
                });
                game.on("gameover", this.onGameOver);
                game.on("arrow_count", (arrow_count) => {
                    this.setState({ arrow_count: arrow_count });
                });
                game.on("countdown", (countdown) => {
                    this.setState({ countdown });
                });
                game.init(this.application, {
                    arrow_count: this.props.arrow_count,
                    game_duration: this.props.game_duration,
                    arrow_score: this.props.arrow_score,
                });
            },
        });
    }
    onGameOver = ({ score, isSuccess }) => {
        if (score > this.props.best_score) {
            this.props.setBestScore(score);
        }
        this.setState({
            showGameResult: true,
            isSuccess,
            score,
        });
        console.log("onGameOver");
        // this.onRestart();
    };
    onRestart = () => {
        const { isSuccess } = this.state;
        const { gametimes } = this.props;
        console.log("onRestart", gametimes, isSuccess);
        if (gametimes === 0) {
            this.toast.info("暂无游戏次数", 2000);
            return;
        }
        Taro.redirectTo({ url: "/pages/gameScene/gameScene?revive=true" });
    };
    changeState = (name, value) => {
        this.setState({ [name]: value });
    };
    onClickModal = (name) => {
        this.setState({ [name]: !this.state[name] });
    };
    render () {
        const {
            showGuide,
            showHeart,
            showSuccessAngel,
            showGameResult,
            showTip,
            isSuccess,
            score,
            game,
            arrow_count,
            countdown,
        } = this.state;
        const ratio = game.getRatio();
        return (
            <View
                id='gameroot'
                ref={(ref) => (this.root = ref)}
                onTouchStart={game.onPointStart}
                onTouchMove={game.onPointMove}
                onTouchEnd={game.onPointEnd}
                onTouchCancel={game.onPointEnd}
                className={styles["canvas"]}
                style={showGameResult ? { pointerEvents: "none" } : {}}
            >
                <Canvas
                    id='canvas'
                    type='webgl'
                    className={styles["canvas"]}
                ></Canvas>
                <Text
                    className={styles["countdown"]}
                    style={{
                        transform: `translate(-50%,-50%) scale(${
                            ratio * countdown.scale
                        })`,
                    }}
                >{`倒计时 ${countdown.value}`}</Text>
                <Text
                    style={{ transform: `translate(-50%,-50%) scale(${ratio})` }}
                    className={styles["arrow-count"]}
                >
                    {`X${arrow_count}`}
                </Text>
                {showGuide ? (
                    <Image
                        src={guide_gif}
                        alt=''
                        className={styles["guide"]}
                        mode='widthFix'
                        style={{ transform: `translateX(-23.913%) scale(${ratio})` }}
                    />
                ) : null}
                {showHeart ? (
                    <Image
                        src={start_heart_gif}
                        alt=''
                        className={styles["heart"]}
                        mode='widthFix'
                        style={{ transform: `translate(-50%,-50%) scale(${ratio})` }}
                    />
                ) : null}
                {showSuccessAngel ? (
                    <Image
                        src={success_angel_gif}
                        alt=''
                        className={styles["success-angel"]}
                        mode='widthFix'
                        style={{ transform: `translate(-50%,-50%) scale(${ratio})` }}
                    />
                ) : null}
                {showGameResult ? (
                    <GameResult
                        isSuccess={isSuccess}
                        score={score}
                        onRestart={this.onRestart}
                    ></GameResult>
                ) : null}
                {showTip ? (
                    <GameTip
                        onClose={() => {
                            this.onClickModal("showTip");
                            this.gameStart();
                        }}
                    ></GameTip>
                ) : null}
                <ToastBox ref={(ref) => (this.toast = ref)}></ToastBox>
            </View>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        arrow_count: game.arrow_count,
        arrow_score: game.arrow_score,
        best_score: game.best_score,
        gametimes: game.gametimes,
        game_duration: game.game_duration,
        userinfo: game.userinfo,
    };
};
const mapDispatchToProps = {
    minusGametimes,
    addGameNumberAction,
    setBestScore,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(GameScene);
export default wrapper;
