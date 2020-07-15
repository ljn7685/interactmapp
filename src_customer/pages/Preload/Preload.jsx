import React, { Component } from "react";

import Taro from "@tarojs/taro";
import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";
import { View, Image, Canvas } from "@tarojs/components";
import { connect } from "react-redux";
import { setPreloaded } from "../../actions/game";

import * as style from "./Preload.module.scss";
import arrow_png from "../../assets/images/loading_arrow.png";
import loading_thumb from "../../assets/images/loading_thumb.png";

import start_player from "../../assets/images/start_player.png";
import start_turntable from "../../assets/images/start_turntable.png";
import turntable from "../../assets/images/turntable.png";
import turntable_line from "../../assets/images/turntable_line.png";
import game_title_icon from "../../assets/images/game_title_icon.png";
import start_heart from "../../assets/images/start_heart.gif";
import loading_bg from "../../assets/images/loading_bg.png";
import bow from "../../assets/images/bow.png";
import arrow from "../../assets/images/arrow.png";
import success_angel from "../../assets/images/success_angel.gif";
import fail_angel from "../../assets/images/fail_angel.png";
import win_title from "../../assets/images/win_title.png";
import lose_title from "../../assets/images/lose_title.png";
import result_bg from "../../assets/images/result_bg.png";

const { registerCanvas, devicePixelRatio } = PIXI.miniprogram;

const content_padding = 9;
const progress_width = 507;
const point_width = 29;
const resources = [
  start_player,
  start_turntable,
  turntable,
  turntable_line,
  game_title_icon,
  start_heart,
  loading_bg,
  bow,
  arrow,
  success_angel,
  fail_angel,
  win_title,
  lose_title,
  result_bg,
];
class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    };
  }
  componentDidMount() {
    if(!this.props.preloaded){
      this.onCanvasReady();
    } else {
      this.setState({ progress: 1 });
      this.onComplete()
    }
  }
  getBarWidth(progress) {
    const contentWidth = progress_width - content_padding;
    const barWidth = Math.max(
      0,
      Math.min(contentWidth * progress, contentWidth - point_width)
    );
    return barWidth;
  }
  onCanvasReady = () => {
    console.log("onCanvasReady", resources);
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
  loadRes = () => {
    console.log("loadRes", resources);
    PIXI.loader
      .add(resources)
      .on("progress", (loader) => {
        this.setState({ progress: loader.progress / 100 });
      })
      .load(this.onComplete);
  };
  onComplete = () => {
    console.log("onComplete");
    setTimeout(() => {
      Taro.redirectTo({
        url: "/pages/GameIndex/GameIndex",
      });
    }, 500);
    this.props.setPreloaded(true);
  };
  render() {
    const barWidth = this.getBarWidth(this.state.progress);
    return (
      <View className={style["bg"]}>
        <Image
          className={style["arrow"]}
          alt=''
          src={arrow_png}
          mode='widthFix'
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
              mode='widthFix'
            />
          </View>
        </View>
        <View className={style["tip-text"]}>Ready...</View>
        <Canvas id='canvas' type='webgl' className={style["canvas"]}></Canvas>
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
const wrapper = connect(mapStateToProps, mapDispatchToProps)(Loading);
export default wrapper;
