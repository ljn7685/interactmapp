import React, { Component } from "react";
import { connect } from "react-redux";

import { View, Image, Text, Canvas } from "@tarojs/components";
import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";

import Game from "./game";
import { modifyGametimes, setBestScore } from "../../actions/game";

import "./GameScene.scss";
import "../../styles/common.scss";
import icon_rule from "../../assets/images/icon_rule.png";
import guide_gif from "../../assets/images/guide.gif";
import start_heart_gif from "../../assets/images/start_heart.gif";
import success_angel_gif from "../../assets/images/success_angel.gif";
// import GameResult from "../GameResult/GameResult";
import useImgLoader from "../../components/img-loader/useImgLoader";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import ToastBox from "../../components/toast/toast";
import Bump from "bump.js";

const { registerCanvas } = PIXI.miniprogram;

class GameScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGuide: true,
            showHeart: false,
            showSuccessAngel: false,
            showGameResult: false,
            // isSuccess: false,
            // score: 0,
            game: new Game(),
        };
    }

    componentDidMount() {
        console.log("didmount");
        if (this.props.gametimes <= 0) {
            Taro.navigateTo(
                "/pages/GameIndex/GameIndex?showToast=true&msg=暂无游戏次数"
            );
        } else {
            this.props.modifyGametimes(this.props.gametimes - 1);
            this.onCanvasReady();
        }
    }
    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        let { game } = this.state;
        if (game) {
            game.destroy();
        }
    }
    gameStart() {
        console.log("gameStart");
        const { game } = this.state;
        game.init(this.application, {
            arrow_count: this.props.arrow_count,
            game_duration: this.props.game_duration,
            arrow_score: this.props.arrow_score,
        });
        game.on("pointstart", this.hideGuide);
        game.on("changeHeart", this.changeHeart);
        game.on("changeSuccessAngel", this.changeSuccessAngel);
        game.on("gameover", this.onGameOver);
        this.showGuide();
    }
    showGuide() {
        this.setState({
            showGuide: true,
        });
        this.timer = setTimeout(this.hideGuide, 1150 * 3);
    }
    onCanvasReady() {
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
                //为pixi引擎注册当前的canvas
                registerCanvas(canvas);
                //初始化PIXI.Application
                //计算application的宽高
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
                console.log("game size", game.width, game.height);
                this.gameStart();
            },
        });
    }
    onGameOver = ({ score }) => {
        // if (score > this.props.best_score) {
        //     this.props.setBestScore(score);
        // }
        this.setState({
            showGameResult: true,
            // isSuccess,
            // score,
        });
        console.log("onGameOver");
        this.onRestart();
    };
    onRestart = () => {
        console.log("onRestart");
        if (this.props.gametimes <= 0) {
            this.toast.info("暂无游戏次数", 2000);
        } else {
            this.props.modifyGametimes(this.props.gametimes - 1);
            const { game } = this.state;
            game.restart();
            this.showGuide();
            this.setState({
                showGuide: true,
                showHeart: false,
                showSuccessAngel: false,
            });
        }
    };
    changeHeart = (visible) => {
        this.setState({
            showHeart: visible,
        });
    };
    changeSuccessAngel = (visible) => {
        this.setState({
            showSuccessAngel: visible,
        });
    };
    hideGuide = () => {
        this.setState({
            showGuide: false,
        });
    };

    render() {
        const {
            showGuide,
            showHeart,
            showSuccessAngel,
            showGameResult,
            // isSuccess,
            // score,
            game,
        } = this.state;
        const { imgList } = this.props;
        return (
            <View
                id="gameroot"
                ref={(ref) => (this.root = ref)}
                onTouchStart={game.onPointStart}
                onTouchMove={game.onPointMove}
                onTouchEnd={game.onPointEnd}
                onTouchCancel={game.onPointEnd}
                className="canvas"
                style={showGameResult ? { pointerEvents: "none" } : {}}
            >
                <Canvas id="canvas" type="webgl" className="canvas"></Canvas>
                <View
                    className="sidebar"
                    onTouchStart={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <View className="side-btn" to="/rule">
                        <Image
                            src={icon_rule}
                            alt=""
                            className="side-img"
                            mode="widthFix"
                        />
                        <Text className="side-btn-desc">游戏规则</Text>
                    </View>
                </View>
                {showGuide && imgList[0].loaded ? (
                    <Image
                        src={guide_gif}
                        alt=""
                        className="guide"
                        mode="widthFix"
                    />
                ) : null}
                {showHeart && imgList[1].loaded ? (
                    <Image
                        src={start_heart_gif}
                        alt=""
                        className="heart"
                        mode="widthFix"
                    />
                ) : null}
                {showSuccessAngel && imgList[2].loaded ? (
                    <Image
                        src={success_angel_gif}
                        alt=""
                        className="success-angel"
                        mode="widthFix"
                    />
                ) : null}
                {/* {showGameResult ? (
          <GameResult
            isSuccess={isSuccess}
            score={score}
            onRestart={this.onRestart}
          ></GameResult>
        ) : null} */}
                <ToastBox ref={(ref) => (this.toast = ref)}></ToastBox>
            </View>
        );
    }
}
const mapgameToProps = ({ game }) => {
    return {
        asset: game.asset_queue,
        arrow_count: game.arrow_count,
        arrow_score: game.arrow_score,
        best_score: game.best_score,
        gametimes: game.gametimes,
        game_duration: game.game_duration,
    };
};
const mapDispatchToProps = {
    modifyGametimes,
    setBestScore,
};

const wrapper = connect(
    mapgameToProps,
    mapDispatchToProps
)(
    useImgLoader(GameScene, [guide_gif, start_heart_gif, success_angel_gif], {
        height: "100vh",
    })
);
export default wrapper;
