import React, { Component } from "react";

import Taro from "@tarojs/taro";
import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";
import { View, Image, Canvas } from "@tarojs/components";
import { connect } from "react-redux";
import { setPreloaded } from "../../actions/game";

import * as style from "./preload.module.scss";
import arrow_png from "../../assets/images/loading_arrow.png";
import loading_thumb from "../../assets/images/loading_thumb.png";
import useImgLoader from "../../components/imgLoader/useImgLoader";

const start_player = "http://q.aiyongbao.com/interact/start_player.png";
const start_turntable = "http://q.aiyongbao.com/interact/start_turntable.png";
const turntable = "http://q.aiyongbao.com/interact/turntable.png";
const turntable_line = "http://q.aiyongbao.com/interact/turntable_line.png";
const game_title_icon = "http://q.aiyongbao.com/interact/game_title_icon.png";
const loading_bg = "http://q.aiyongbao.com/interact/loading_bg.png";
const bow = "http://q.aiyongbao.com/interact/bow.png";
const arrow = "http://q.aiyongbao.com/interact/arrow.png";
const fail_angel = "http://q.aiyongbao.com/interact/fail_angel.png";
const win_title = "http://q.aiyongbao.com/interact/win_title.png";
const lose_title = "http://q.aiyongbao.com/interact/lose_title.png";
const result_bg = "http://q.aiyongbao.com/interact/result_bg.png";
const titleIcon = "http://q.aiyongbao.com/interact/game_title_icon.png";
const icon_gift = "http://q.aiyongbao.com/interact/icon_gift.png";
const icon_rule = "http://q.aiyongbao.com/interact/icon_rule.png";
const heart_img = "http://q.aiyongbao.com/interact/rule_heart.png";
const close_btn_img = "http://q.aiyongbao.com/interact/close_btn.png";
const coupon_img = "http://q.aiyongbao.com/interact/coupon.png";

const guide_gif = "http://q.aiyongbao.com/interact/guide.gif";
const start_heart_gif = "http://q.aiyongbao.com/interact/start_heart.gif";
const success_angel_gif = "http://q.aiyongbao.com/interact/success_angel.gif";

const { registerCanvas, devicePixelRatio } = PIXI.miniprogram;

const content_padding = 9;
const progress_width = 507;
const point_width = 29;
/**
 * 游戏资源
 */
const resources_game = [
    { name: "start_player", url: start_player },
    { name: "turntable", url: turntable },
    { name: "turntable_line", url: turntable_line },
    { name: "loading_bg", url: loading_bg },
    { name: "bow", url: bow },
    { name: "arrow", url: arrow },
    { name: "fail_angel", url: fail_angel },
];
/**
 * 非游戏UI资源
 */
const resources_ui = [
    win_title,
    lose_title,
    result_bg,
    titleIcon,
    icon_gift,
    icon_rule,
    heart_img,
    close_btn_img,
    coupon_img,
    game_title_icon,
    start_turntable,
    start_player,
    loading_bg,
    guide_gif,
    start_heart_gif,
    success_angel_gif,
];
class Preload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_progress: 0,
            game_progress: 0,
            ui_progress: 0,
        };
    }
    componentDidMount() {
        if (!this.props.preloaded) {
            this.onCanvasReady();
        } else {
            this.setState({ progress: 1 });
            this.onComplete();
        }
    }
    /**
     * 计算进度条长度
     * @param {*} progress 进度
     */
    getBarWidth(progress) {
        const contentWidth = progress_width - content_padding;
        const barWidth = Math.max(
            0,
            Math.min(contentWidth * progress, contentWidth - point_width)
        );
        return barWidth;
    }
    onCanvasReady = () => {
        console.log("onCanvasReady");
        // 建立canvas引用
        // eslint-disable-next-line no-undef
        my._createCanvas({
            id: "canvas",
            success: (canvas) => {
                canvas.width = 2;
                canvas.height = 2;
                this.pixiCanvas = canvas;
                registerCanvas(canvas);
                const size = {
                    width: canvas.width / devicePixelRatio,
                    height: canvas.height / devicePixelRatio,
                };
                const context = canvas.getContext("2d");
                // eslint-disable-next-line no-unused-vars
                const application = new PIXI.Application({
                    width: size.width,
                    height: size.height,
                    view: canvas,
                    context: context,
                    transparent: true,
                    // 强制使用2d上下文进行渲染，如果为flase,则默认使用webgl渲染
                    forceCanvas: true,
                    // 设置resolution 为像素密度
                    resolution: devicePixelRatio,
                });
                this.loadRes();
            },
        });
    };
    /**
     * 加载资源
     */
    loadRes = () => {
        console.log("loadRes", resources_game);
        PIXI.loader
            .add(resources_game)
            .on("progress", ({ progress }) => {
                this.onProgress({ progress: progress / 100, type: "game" });
            })
            .load(this.onComplete);
    };
    onProgress = (loader) => {
        console.log("onProgress", loader);
        const total = resources_game.length + resources_ui.length;
        const game_ratio = resources_game.length / total;
        const ui_ratio = resources_ui.length / total;
        const { game_progress, ui_progress } = this.state;
        if (loader.type === "game") {
            this.setState({
                game_progress: loader.progress,
                total_progress: loader.progress * game_ratio + ui_progress,
            });
        } else {
            this.setState({
                ui_progress: loader.progress,
                total_progress: loader.progress * ui_ratio + game_progress,
            });
        }
    };
    /**
     * 加载完成回调
     */
    onComplete = () => {
        console.log("onComplete", this.state.total_progress);
        if (this.state.total_progress < 1) return;
        setTimeout(() => {
            Taro.redirectTo({
                url: "/pages/gameIndex/gameIndex",
            });
        }, 500);
        this.props.setPreloaded(true);
    };
    render() {
        const barWidth = this.getBarWidth(this.state.total_progress);
        return (
            <View className={style["bg"]}>
                <Image
                    className={style["arrow"]}
                    alt=""
                    src={arrow_png}
                    mode="widthFix"
                />
                <View className={style["progress"]}>
                    <View className={style["progress-content"]}>
                        <View
                            className={style["progress-bar"]}
                            style={{ width: `${Taro.pxTransform(barWidth)}` }}
                        ></View>
                        <Image
                            className={style["progress-point"]}
                            src={loading_thumb}
                            mode="widthFix"
                        />
                    </View>
                </View>
                <View className={style["tip-text"]}>Ready...</View>
                <Canvas
                    id="canvas"
                    type="webgl"
                    className={style["canvas"]}
                ></Canvas>
                <View
                    className={style["bottom-tip"]}
                >{`请使用手机淘宝(版本>=9.8.0)打开`}</View>
            </View>
        );
    }
}
const mapStateToProps = ({ game }) => {
    return {
        preloaded: game.preloaded,
    };
};
const mapDispatchToProps = {
    setPreloaded,
};
const wrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(useImgLoader(Preload, resources_ui));
export default wrapper;
