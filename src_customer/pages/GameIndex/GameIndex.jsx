import React, { Component } from "react";
import { connect } from "react-redux";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";

import styles from "./GameIndex.module.scss";
import "../../styles/common.scss";
import titleIcon from "../../assets/images/game_title_icon.png";
import start_turntable from "../../assets/images/start_turntable.png";
import start_player from "../../assets/images/start_player.png";
import start_heart from "../../assets/images/start_heart.gif";
import icon_gift from "../../assets/images/icon_gift.png";
import icon_rule from "../../assets/images/icon_rule.png";
import icon_rank from "../../assets/images/icon_rank.png";

import GameRule from "../GameRule/GameRule";
import ToastBox from "../../components/toast/toast";
class GameIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRotate: true,
      showRule: false,
    };
  }

  componentDidMount() {
    let { showToast, msg } = getCurrentInstance().router.params;
    console.log(getCurrentInstance().router.params);
    if (showToast) {
      this.setState({
        isRotate: false,
      });
      this.toast.info(msg, 2000, () => {
        this.setState({
          isRotate: true,
        });
      });
    }
  }
  onGameStart = () => {
    Taro.redirectTo({
      url: "/pages/GameScene/GameScene",
    });
  };
  onClickRule = () => {
    const { showRule } = this.state;
    this.setState({ showRule: !showRule });
  };
  render() {
    const { showRule } = this.state;
    return (
      <View className={styles["bg"]} ref={(ref) => (this.root = ref)}>
        <View className={styles["title"]}>
          <Image
            src={titleIcon}
            alt=''
            className={styles["title-img"]}
            mode='widthFix'
          />
          <Text className={styles["title-desc"]}>{this.props.subtitle}</Text>
        </View>
        <View className={styles["game-preview"]}>
          <Image
            src={start_turntable}
            alt=''
            className={`${styles["preview-turntable"]} ${
              this.state.isRotate ? styles["preview-rotate"] : ""
            }`}
            mode='widthFix'
          />
          <Image
            src={start_player}
            alt=''
            className={styles["preview-content"] + " " + styles["player"]}
            mode='widthFix'
          />
          <Image
            src={start_heart}
            alt=''
            className={styles["preview-content"] + " " + styles["heart"]}
            mode='widthFix'
          />
        </View>
        <View className={styles["game-info"]}>
          当前游戏次数: {this.props.gametimes}
        </View>
        <View className={styles["game-button-group"]}>
          <View
            className={styles["start-game"] + " " + styles["button"]}
            onClick={this.onGameStart}
          >
            开始游戏 赢好礼
          </View>
          <Button
            className={styles["game-times"] + " " + styles["button"]}
            to='/task'
          >
            获取游戏次数
          </Button>
        </View>
        <View className={styles["game-desc"]}>连续参与游戏成功率更高哦</View>
        <View className='sidebar'>
          <View className='side-btn' onClick={this.onClickRule}>
            <Image
              src={icon_rule}
              alt=''
              className='side-img'
              mode='widthFix'
            ></Image>
            <Text className='side-btn-desc'>游戏规则</Text>
          </View>
          <View className='side-btn' to='/gift'>
            <Image
              src={icon_gift}
              alt=''
              className='side-img'
              mode='widthFix'
            ></Image>
            <Text className='side-btn-desc'>我的礼品</Text>
          </View>
          <View className='side-btn' to='/gamerank'>
            <Image
              src={icon_rank}
              alt=''
              className='side-img'
              mode='widthFix'
            ></Image>
            <Text className='side-btn-desc'>排行榜</Text>
          </View>
        </View>
        {showRule ? <GameRule onClose={this.onClickRule}></GameRule> : null}
        <ToastBox ref={(ref) => (this.toast = ref)}></ToastBox>
      </View>
    );
  }
}
const mapStateToProps = ({ game }) => {
  return { gametimes: game.gametimes, subtitle: game.subtitle };
};
const wrapper = connect(mapStateToProps, null)(GameIndex);
export default wrapper;
